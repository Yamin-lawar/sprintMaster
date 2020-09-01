const Project = require('../models/project') 
const User = require('../models/user')  
import {logger, customErrorHandler, validationErrorResponse} from '../utils/general'
import { createProjectValidation, updateProjectValidation, removeProjectValidation} from '../validations/validator'
import authMiddleware from '../middlewares/auth'
const mongoose = require('mongoose');
module.exports = {
            /**
             * get all teams (Query)
             * @author Yamin
             */
            projects: async(args, context) =>  {
                await authMiddleware(context)
                try{
                  let queryCondition = {};
                  if(typeof args._id !== "undefined"){
                    queryCondition = {_id: args._id}
                  }
                  const projectList = await Project.find(queryCondition).populate('smj').populate('dsmj').populate('po').populate('spo');
                  return projectList
                }catch(err){
                  logger('team',`Get Team: Problem in getting all team: ${err}`);
                  throw customErrorHandler('Problem in getting team list', 500);
                }
                
            },
            /**
             * Create project (Mutation)
             * @author Yamin
             * @param argsm context
             */
            
            createProject: async(args,context) => {
                await authMiddleware(context)
                const session = await mongoose.startSession();
                session.startTransaction();
                try{
                    const opts = { session, new: true };
                    const checkResponse = createProjectValidation.validate(args.input);
                    if(checkResponse.error !== undefined){
                      return validationErrorResponse(checkResponse.error)
                    }
                    const {name, code, smj, dsmj, po, spo, status} = args.input
                    //check same team avail or not 
                    const projectExist = await Project.findOne({name: name},null,opts);
                    if(projectExist !== null){
                      throw customErrorHandler('Project already exist, enter different name', 500);
                    }
                    const createProject = new Project({
                      name: name,
                      code: code,
                      smj: smj,
                      dsmj: dsmj !== "" ? dsmj : null,
                      po: po,
                      spo: spo !== "" ? spo : null,
                      status: status
                    });

                    return createProject.save(opts).then(async result => {
                        //update role in users
                        console.log(result._doc._id,'result._doc._id')
                        const smjAdded = await module.exports.updateRoleForProject(smj,'smj',result._doc._id,false,opts)
                        const dsmjAdded = await module.exports.updateRoleForProject(dsmj,'dsmj',result._doc._id,false,opts)
                        const poAdded = await module.exports.updateRoleForProject(po,'po',result._doc._id,false,opts)
                        const spoAdded = await module.exports.updateRoleForProject(spo,'spo',result._doc._id,false,opts)

                        if(smjAdded !== "success" || dsmjAdded !== "success" || poAdded !== "success" || spoAdded !== "success"){
                          throw customErrorHandler('Problem in adding project', 500);
                        }
                        await session.commitTransaction();
                        session.endSession();
                        return {project: result._doc}
                    }).catch(async err => {
                      await session.abortTransaction();
                      session.endSession();
                      logger('team',`Create Project: Problem in adding project: ${err}`);
                      throw customErrorHandler('Problem in adding project', 500);
                    });

                 }catch(err){
                       console.log(err,'err')
                       await session.abortTransaction();
                       session.endSession();
                       logger('project',`Create Project: Problem in adding project: ${err}`);
                       throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in adding project', 500);
                 }    
            }, 
            /**
             * update project (Mutation)
             * @author Yamin
             * @param argsm context
             */
            
            updateProject: async(args,context) => {
              await authMiddleware(context)
              try{
                const checkResponse = updateProjectValidation.validate(args.input);
                if(checkResponse.error !== undefined){
                  return validationErrorResponse(checkResponse.error)
                }
                const {_id, name, code, smj, dsmj, po, spo, status} = args.input
                //check project name exist
                const projectExist = await Project.findOne({name: name, _id: { $ne: _id }});
                if(projectExist !== null){
                    throw customErrorHandler('Project already exist, enter different name', 500);
                }
                const projectDetail = await Project.findOne({_id: _id });
                if(projectDetail == null){
                    throw customErrorHandler('Project not found', 500);
                }
                let updateProjectPayload = {}
                if(projectDetail.name !== name){
                    //update name
                    updateProjectPayload.name = name
                }
                if(projectDetail.code !== code){
                  //update code
                  updateProjectPayload.code = code
                }
                if(projectDetail.smj != smj){
                  //update smj
                  updateProjectPayload.smj = smj
                  await module.exports.updateRoleForProject(smj,'smj',_id,true)
                }
                if(projectDetail.dsmj != dsmj){
                  //update dsmj
                  updateProjectPayload.dsmj = dsmj == "" ? null : dsmj
                  await module.exports.updateRoleForProject(dsmj,'dsmj',_id, true)
                }
                if(projectDetail.po != po){
                  //update po
                  updateProjectPayload.po = po
                  await module.exports.updateRoleForProject(po,'po',_id, true)
                }
                if(projectDetail.spo != spo){
                  //update spo
                  updateProjectPayload.spo = spo == "" ? null : spo
                  await module.exports.updateRoleForProject(spo,'spo',_id, true)
                }
                if(projectDetail.status != status){
                  //update spo
                  updateProjectPayload.status = status
                }
                console.log(updateProjectPayload,'updateProjectPayload')
                const updateProject = await Project.update({_id:_id},{$set: updateProjectPayload})
                if(updateProject.nModified == 0){
                  logger('project',`Update Project: Problem in updating project detail: ${_id}`);  
                  throw customErrorHandler('Problem in updating project', 500);  
                }
                console.log(projectDetail,'projectExist')
                return {project: projectDetail}
              }catch(err){
                  logger('project',`Update Project: Problem in updating project: ${err}`);
                  throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in updating project', 500);
              }
            },

            /**
             * Update role common function
             * @author Yamin
             * @param id role project
             */
            updateRoleForProject: async(id, role, project, updateRole = false, opts) => {
              console.log('up[date role',opts)
              try{
                  if(id !== ""){
                    const getUserDetail = await User.findOne({_id: id},null, opts)
                    if(getUserDetail == null){
                      throw customErrorHandler('User is not found for role '+role, 500);
                    }
                  }
                  console.log(updateRole,'updateRole')
                  if(updateRole){
                    const userRoleRemove = await User.update(
                      { },
                      { $pull: { role: { role: role, project: project } } },
                      { multi: true},
                      opts
                    )
                    console.log(userRoleRemove,'userRoleRemove')
                    if(userRoleRemove.nModified == 0){
                      logger('project',`Update Project role: Problem in removing project role: ${role}, project: ${project}`);  
                      throw customErrorHandler('Problem in updating project', 500); 
                    }
                  }
                  
                  if(id !== ""){
                      const userRoleUpdate = await User.update({_id:id},{ $push: {
                        "role":{
                          project: project,
                          role: role
                      }}},opts)  
                      if(userRoleUpdate.nModified == 0){
                        logger('project',`Update Project role: Problem in updating project role: ${role}, project: ${project}`);  
                        throw customErrorHandler('Problem in updating project', 500); 
                      }
                  }
                  return "success"  
              }catch(err){
                console.log(err)
                logger('project',`Create project: Problem in adding project: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in adding project', 500);
                return false
              }
            },
            /**
             * Remove project and all its access
             * @author Yamin
             * Object args
             */
            removeProject: async (args,context) => {
              await authMiddleware(context)
              try{
                const checkResponse = removeProjectValidation.validate(args.input);
                if(checkResponse.error !== undefined){
                  return validationErrorResponse(checkResponse.error)
                }
                const projectExist = await Project.findOne({_id: args.input._id});
                if(projectExist == null){
                    throw customErrorHandler("Project doesn't exist, enter different name", 500);
                }
                const removeProject = await Project.delete({_id: args.input._id})
                if(removeProject.deletedCount == 0){
                    throw customErrorHandler('Problem in removing project', 500);
                }
                const userRoleRemove = await User.update(
                  { },
                  { $pull: { role: {project: args.input._id } } },
                  { multi: true}
                )
                if(userRoleRemove.nModified == 0){
                  logger('project',`Remove Project role: Problem in removing project and its role for project: ${args.input._id}`);  
                  throw customErrorHandler('Problem in updating project', 500); 
                }
                return {message: "Project removed successuflly"}
              }catch(err){
                  logger('project',`Remove Project: Problem in removing project: ${err}`);
                  throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in removing project', 500);
              }
            }
           
}


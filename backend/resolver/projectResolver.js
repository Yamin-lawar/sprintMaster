const Project = require('../models/project') 
const User = require('../models/user')  
import {logger, customErrorHandler, validationErrorResponse} from '../utils/general'
import { createProjectValidation, updateProjectValidation } from '../validations/validator'
import authMiddleware from '../middlewares/auth'
import { update } from '../models/project'
import { concatAST } from 'graphql'
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
                try{
                    const checkResponse = createProjectValidation.validate(args.input);
                    if(checkResponse.error !== undefined){
                      return validationErrorResponse(checkResponse.error)
                    }
                    const {name, code, smj, dsmj, po, spo, status} = args.input
                    //check same team avail or not 
                    const projectExist = await Project.findOne({name: name});
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

                    return createProject.save().then(async result => {
                        //update role in users
                        console.log(result._doc._id,'result._doc._id')
                        await module.exports.updateRoleForProject(smj,'smj',result._doc._id)
                        await module.exports.updateRoleForProject(dsmj,'dsmj',result._doc._id)
                        await module.exports.updateRoleForProject(po,'po',result._doc._id)
                        await module.exports.updateRoleForProject(spo,'spo',result._doc._id)
                        return {project: result._doc}
                    }).catch(err => {
                      console.log(err,'err')
                      logger('team',`Create Project: Problem in adding project: ${err}`);
                      throw customErrorHandler('Problem in adding project', 500);
                    });

                 }catch(err){
                       console.log(err,'err')
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
            updateRoleForProject: async(id, role, project, updateRole = false) => {
              console.log('up[date role')
              try{
                  if(id !== ""){
                    const getUserDetail = await User.findOne({_id: id})
                    if(getUserDetail == null){
                      throw customErrorHandler('User is not found for role '.role, 500);
                    }
                  }
                  console.log(updateRole,'updateRole')
                  if(updateRole){
                    console.log('sdfrg', role, project)
                    const userRoleRemove = await User.update(
                      { },
                      { $pull: { role: { role: role, project: project } } },
                      { multi: true}
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
                      }}})  
                      if(userRoleUpdate.nModified == 0){
                        logger('project',`Update Project role: Problem in updating project role: ${role}, project: ${project}`);  
                        throw customErrorHandler('Problem in updating project', 500); 
                      }
                  }
                  return true  
              }catch(err){
                console.log(err)
                logger('project',`Create project: Problem in adding project: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in adding project', 500);
                return false
              }
            }
           
}


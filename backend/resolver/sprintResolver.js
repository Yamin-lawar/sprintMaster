const Sprint = require('../models/sprint') 
const Project = require('../models/project') 
import {logger, customErrorHandler, validationErrorResponse} from '../utils/general'
import { createSprintValidation, addUpdateTaskValidation, updateTaskStatusValidation, updateSprintValidation,  deleteSprintValidation, updateProjectRankingValidation, addCommentValidation, updateCommentValidation, deleteCommentValidation} from '../validations/validator'
import authMiddleware from '../middlewares/auth'
import sprint from '../models/sprint'
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
module.exports = {
            
            /**
             * Create Sprint initially by BA or PO without tasks and allocation(Mutation)
             * @author Yamin
             * @param {args,context}
             */
            
            createSprint: async(args,context) => {
                await authMiddleware(context)
                try{
                    const checkResponse = createSprintValidation.validate(args.input);
                    if(checkResponse.error !== undefined){
                      return validationErrorResponse(checkResponse.error)
                    } 
                    const {name, code, startDate, endDate, sprintHours, createdBy} = args.input
                    //check same sprint avail or not 
                    const sprintExist = await Sprint.findOne({name: name});
                    if(sprintExist !== null){
                      throw customErrorHandler('Sprint already exist, enter different name', 500);
                    }
                    //get current active project to automatically add when sprint starts
                    const activeProjects = await Project.find({status: 'Active'})
                    let projectArray = [];
                    if(activeProjects.length > 0){
                        activeProjects.map((projectList) => {
                          projectArray.push(projectList)
                        })
                        
                    }
                    //automatically get status of sprint from date
                    const currentDate = new Date()
                    let sprintStatus = ''
                    if(currentDate<startDate){
                      sprintStatus = 'Pending'
                    }else if(currentDate>endDate){
                      sprintStatus = 'Completed'
                    }else if(currentDate>=startDate){
                      sprintStatus = 'Active'
                    }
                    const createSprint = new Sprint({
                      name: name,
                      code: code,
                      startDate: startDate,
                      endDate: endDate,
                      sprintHours: sprintHours,
                      createdBy: createdBy,
                      status: sprintStatus,
                      projects: projectArray
                    });

                    await createSprint.save()
                    return {message: "Sprint created successfully"}

                 }catch(err){
                       logger('project',`Create Project: Problem in adding project: ${err}`);
                       throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in adding project', 500);
                 }    
            }, 


             /**
             * Add/update/remove tasks in perticular project and sprint 
             * @author Yamin
             * @param {args,context}
             */
            
            addUpdateTask: async(args,context) => {
                  await authMiddleware(context)
              try{
                    
                    const checkResponse = addUpdateTaskValidation.validate(args.input);
                    if(checkResponse.error !== undefined){
                      return validationErrorResponse(checkResponse.error)
                    }
                    const tasksData = args.input;
                    //check if sprint is active or of future use
                    const checkSprinAndProject = await module.exports.checkActiveSprintAndProject(tasksData.sprintId, true, tasksData.projectId)
                    if(checkSprinAndProject !== "pass"){
                        throw checkSprinAndProject
                    }
                    const taskDataInput = [] ;
                    let totalCompletion = 0
                    tasksData.tasks.map((taskArray,index)=>{
                      totalCompletion += taskArray.completion ? taskArray.completion : 0
                      taskDataInput.push({
                        "_id": new ObjectID(),
                        "name": taskArray.name,
                        "user": taskArray.user,
                        "hours": taskArray.hours,
                        "createdBy": context.request.currentUser.id,
                        "createdAt": Date("Y-m-d H:i:s"),
                        "completion": taskArray.completion ? taskArray.completion : 0,
                        "status": "Pending", 
                      })
                    })
                    const completionRate = totalCompletion/tasksData.tasks.length
                    const sprintUpdate = await Sprint.update(
                      { 
                        "_id" : tasksData.sprintId, 
                        "projects._id" : tasksData.projectId
                      },
                      {    
                        $set : { "projects.$.task" : taskDataInput, "projects.$.completion": completionRate } 
                      } 
                    )
                    const sprintOutput = module.exports.updateSprintCompletionAndGetSprintData(tasksData.sprintId)
                    return {"sprint": sprintOutput}
                  }catch(err){
                    console.log(err,'err')
                    logger('project',`Update Task: Problem in updating task: ${err}`);
                    throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in updating task', 500);
                  }  
            },
            /**
             * Update status or completion rate of perticular task
             * @author Yamin 
             * @param {args,context}
             */

            updateTaskStatus: async(args,context) => {
                await authMiddleware(context)
                try{
                  const checkResponse = updateTaskStatusValidation.validate(args.input);
                  if(checkResponse.error !== undefined){
                    return validationErrorResponse(checkResponse.error)
                  }
                  //check if sprint is active or of future use
                  const tasksData = args.input;
                  const checkSprinAndProject = await module.exports.checkActiveSprintAndProject(tasksData.sprintId, true, tasksData.projectId)
                  if(checkSprinAndProject !== "pass"){
                      throw checkSprinAndProject
                  }
                  const sprintData = await Sprint.findOne({
                    "_id" : tasksData.sprintId, 
                    "projects._id" : tasksData.projectId
                  })
                 
                  console.log(sprintData,'sprintData',sprintData.projects.task)
                  let projectCompletion = 0;
                    ///get project and update its completion
                    sprintData.projects.task.map((taskData) => {
                      console.log(sprintData.projects._id, tasksData.projectId,'tasksData.projectIdsd')
                      if(sprintData.projects._id == tasksData.projectId){
                        console.log(taskData.completion,'taskData.completion')
                        projectCompletion += taskData.completion
                      }
                    })
                  
                  const sprintUpdate = await Sprint.update(
                    { 
                      "_id" : tasksData.sprintId, 
                      "projects._id" : tasksData.projectId
                    },
                    {    
                      $set : { "projects.$.completion": projectCompletion,"projects.$.task.$[j].completion" : tasksData.completion, "projects.$.task.$[j].status" : tasksData.status } 
                    }, { 
                      arrayFilters: [
                        {
                          "j._id": tasksData.taskId
                        }
                      ]
                    } 
                  )
                  if(sprintUpdate.nModified !== 1){
                    throw customErrorHandler('Problem in updating task status', 500);
                  }
                  const sprintOutput = module.exports.updateSprintCompletionAndGetSprintData(tasksData.sprintId)
                  return {"sprint": sprintOutput}
                }catch(err){
                  console.log(err,'err')
                  logger('project',`Update Task status: Problem in updating task status: ${err}`);
                  throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in updating task status', 500);
                }
            },
            /**
             * common function to check sprint and project status
             * @author Yamin 
             * @param {args,context}
             */

            checkActiveSprintAndProject: async(sprintId, checkProject = false, projectId = null) => {
                const currentDate = new Date().toISOString()
                const sprintExpires = await Sprint.findOne({endDate: { $lt: currentDate}, _id: sprintId})
                if(sprintExpires !== null){
                  return customErrorHandler('Sprint expired, you cannot update it', 500);
                }
                //check if prpject is active or not
                if(checkProject){
                  const activeProjects = await Project.findOne({status: { $ne: 'Active'}, _id: projectId})
                  if(activeProjects !== null){
                    return customErrorHandler('project is not active, you cannot update it', 500);
                  }
                }
                return "pass"
            },
            /**
             * Commonf function : Update sprint completion rate and then get sprint data
             * @author Yamin 
             * @param {sprintId}
             */
            updateSprintCompletionAndGetSprintData: async(sprintId) => {
              //update total completion rate of sprint 
              const sprintData = await Sprint.findOne({
                _id: sprintId
              })
              let allProjectCompletion = 0;
              sprintData.projects.map((allProjectData)=>{
                  allProjectCompletion += allProjectData.completion ? allProjectData.completion : 0
              })
              const sprintCompletionUpdate = await Sprint.update(
                { 
                  "_id" : sprintId, 
                },
                {    
                  $set : { "completion" : allProjectCompletion/sprintData.projects.length} 
                }  
              )
              //get latest sprint data
              const sprintOutput = await Sprint.findOne({_id: sprintId})
              .populate('createdBy')
              .populate('projects.po') 
              .populate('projects.spo')
              .populate('projects.smj')
              .populate('projects.dsmj')
              .populate('projects.task.createdBy')
              .populate('projects.task.user')
              .populate('projects.task.comments.user');
              return sprintOutput
            },
            /**
             * update sprint detail which was added at create sprint time 
             * @author Yamin
             * @param {args, context}
             */
            updateSprint: async(args,context) =>{
              await authMiddleware(context)
              try{
                const checkResponse = updateSprintValidation.validate(args.input);
                if(checkResponse.error !== undefined){
                  return validationErrorResponse(checkResponse.error)
                } 
                const {sprintId, name, code, startDate, endDate, sprintHours} = args.input
                //check sprint is not expired
                const checkSprinAndProject = await module.exports.checkActiveSprintAndProject(sprintId, false)
                if(checkSprinAndProject !== "pass"){
                    throw checkSprinAndProject
                }
                //check same sprint avail or not 
                const sprintExist = await Sprint.findOne({_id: {$ne: sprintId}, name: name});
                if(sprintExist !== null){
                  throw customErrorHandler('Sprint already exist, enter different name', 500);
                }
                const sprintUpdate = await Sprint.update(
                  { 
                    "_id" : sprintId, 
                  },
                  {    
                    $set: {name: name, code: code, startDate: startDate, endDate: endDate, sprintHours: sprintHours}
                  } 
                )
                return {message: "Sprint updated successfully"}
              }catch(err){
                logger('project',`Update sprint: Problem in updating sprint: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in updating sprint', 500);
              }
            },
            /**
             * Delete sprint if sprint is not expired or completed
             * @author Yamin
             * @param {args, context}
             */
            removeSprint: async(args,context) =>{
              await authMiddleware(context)
              try{
                const checkResponse = deleteSprintValidation.validate(args.input);
                if(checkResponse.error !== undefined){
                  return validationErrorResponse(checkResponse.error)
                } 
                const checkSprinAndProject = await module.exports.checkActiveSprintAndProject(args.input._id, false)
                if(checkSprinAndProject !== "pass"){
                    throw checkSprinAndProject
                }  
                const removeSprint = await Sprint.delete({_id: args.input._id})
                console.log(removeSprint,'removeSprint.deletedCount')
                if(removeSprint.nModified == 0){
                    throw customErrorHandler('Problem in deleting sprint', 500);
                } 
                return {message: "Sprint removed successfully"}
              }catch(err){
                logger('project',`Delete sprint: Problem in deleting sprint: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in deleting sprint', 500);
              }
            },
            /**
             * Update sprint project rating
             * @author Yamin
             * @param {args,context}
             */
            updateProjectRanking: async(args, context) => {
              await authMiddleware(context)
              try{
                //TODO: check only po can and guruji can update this
                const checkResponse = updateProjectRankingValidation.validate(args.input);
                if(checkResponse.error !== undefined){
                  return validationErrorResponse(checkResponse.error)
                }  
                const {sprintId, projectId, poRanking, gurujiRanking} = args.input
                if(poRanking && poRanking !== undefined){
                  const rankingUpdate = await Sprint.update(
                    { 
                      "_id" : sprintId, 
                      "projects._id" : projectId
                    },
                    {    
                      $set : { "projects.$.poRanking" : poRanking } 
                    }
                  )
                  if(rankingUpdate.nModified !== 1){
                    throw customErrorHandler('Problem in updating po ranking', 500);
                  }
                }
                if(gurujiRanking && gurujiRanking !== undefined){
                  const rankingUpdate = await Sprint.update(
                    { 
                      "_id" : sprintId, 
                      "projects._id" : projectId
                    },
                    {    
                      $set : { "projects.$.gurujiRanking" : gurujiRanking } 
                    }
                  )
                  if(rankingUpdate.nModified !== 1){
                    throw customErrorHandler('Problem in updating guruji ranking', 500);
                  }
                }
                return {message: "Ranking updated successfully"}
              }catch(err){
                logger('sprint',`update sprint ranking: Problem in updating sprint ranking: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in updating sprint ranking', 500);
              }
            },
            /**
             * Add comment for any task 
             * @author Yamin
             * @param {args,context}
             */
            addComment: async(args, context) => {
              await authMiddleware(context)
              try{
                const checkResponse = addCommentValidation.validate(args.input);
                if(checkResponse.error !== undefined){
                  return validationErrorResponse(checkResponse.error)
                }  
                const {sprintId, projectId, taskId, comment} = args.input
                const checkSprinAndProject = await module.exports.checkActiveSprintAndProject(sprintId, true, projectId)
                if(checkSprinAndProject !== "pass"){
                      throw checkSprinAndProject
                }
                const commentAdd = await Sprint.update(
                  { 
                    "_id" : sprintId, 
                    "projects._id" : projectId
                  },
                  {    
                    $push : { "projects.$.task.$[j].comments" : {
                      "_id": new ObjectID(),
                      "user": context.request.currentUser.id,
                      "comment": comment,
                      "createdAt": Date("Y-m-d H:i:s")
                    } } 
                  } , { 
                    arrayFilters: [
                      {
                        "j._id": taskId
                      }
                    ]
                  } 
                )
                if(commentAdd == null){
                  throw customErrorHandler('Problem in adding comment', 500);
                }
                return {message: "Comment added successfully"}
                
              }catch(err){
                console.log(err,'error')
                logger('sprint',`add comment: Problem in adding comment: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in adding comment', 500);
              } 
            },
            /**
             * Update comment for any task by owner of comment
             * @author Yamin
             * @param {args,context}
             */
            updateComment: async(args, context) => {
              await authMiddleware(context)
              try{
                const checkResponse = updateCommentValidation.validate(args.input);
                if(checkResponse.error !== undefined){
                  return validationErrorResponse(checkResponse.error)
                }  
                const {sprintId, projectId, taskId, commentId, comment} = args.input
                const checkSprinAndProject = await module.exports.checkActiveSprintAndProject(sprintId, true, projectId)
                if(checkSprinAndProject !== "pass"){
                      throw checkSprinAndProject
                }
                console.log(context.request.currentUser.id,'context.request.currentUser.id') 
                //check onwer of comments
                const commentOwner = await Sprint.find({
                  "_id" : sprintId, 
                  "projects._id" : projectId,
                  "projects": {
                    $elemMatch: {
                      "task._id": taskId,
                      "task.comments":{
                          $elemMatch: {
                            "user": context.request.currentUser.id,
                            "_id": commentId
                          }
                      }
                    }
                  }
                });
                
                if(commentOwner.length == 0){
                  throw customErrorHandler('You cannot edit this comment', 500);
                }
                console.log(commentOwner,'commentOwner')
                const commentAdd = await Sprint.update(
                  { 
                    "_id" : sprintId, 
                    "projects._id" : projectId
                  },
                  {    
                    $set : { "projects.$.task.$[j].comments.$[k].comment" : comment } 
                  } , { 
                    arrayFilters: [
                      {
                        "j._id": taskId
                      },
                      {
                        "k._id": commentId
                      }
                    ]
                  } 
                )
                if(commentAdd == null){
                  throw customErrorHandler('Problem in updatig comment', 500);
                }
                return {message: "Comment updated successfully"}
                
              }catch(err){
                console.log(err,'error')
                logger('sprint',`add comment: Problem in updating comment: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in updating comment', 500);
              } 
            },
            /**
             * Delete comment 
             * @author Yamin
             * @param {args, context}
             */
            removeComment: async(args,context) =>{
              await authMiddleware(context)
              try{
                const checkResponse = deleteCommentValidation.validate(args.input);
                if(checkResponse.error !== undefined){
                  return validationErrorResponse(checkResponse.error)
                } 
                const {sprintId, projectId, taskId, commentId} = args.input
                //check owner 
                const commentOwner = await Sprint.find({
                  "_id" : sprintId, 
                  "projects._id" : projectId,
                  "projects": {
                    $elemMatch: {
                      "task._id": taskId,
                      "task.comments":{
                          $elemMatch: {
                            "user": context.request.currentUser.id,
                            "_id": commentId
                          }
                      }
                    }
                  }
                });
                
                if(commentOwner.length == 0){
                  throw customErrorHandler('You cannot remove this comment', 500);
                }
                const commentRemove = await Sprint.updateOne(
                  { 
                    "_id" : sprintId, 
                    "projects._id" : projectId
                  },
                  {    
                    $pull : { "projects.$.task.$[j].comments" : {"_id": commentId} } 
                  } , { 
                    arrayFilters: [
                      {
                        "j._id": taskId
                      }
                     ]
                  } 
                )
                console.log(commentRemove,'commentRemove')
                if(commentRemove.nModified == 0){
                    throw customErrorHandler('Problem in removing comment', 500);
                } 
                return {message: "comment removed successfully"}
              }catch(err){
                logger('sprint',`Remove sprint: Problem in removing comment: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in deleting comment', 500);
              }
            },
             /**
             * List sprints 
             * @author Yamin
             * @param {args, context}
             */
            sprints: async(args,context) =>{
              await authMiddleware(context)
              try{
                let queryCondition = {};
                if(typeof args._id !== "undefined"){
                  queryCondition = {_id: args._id}
                }
                const sprintData = await Sprint.find(queryCondition)
                .populate('createdBy')
                .populate('projects.po')
                .populate('projects.spo')
                .populate('projects.smj')
                .populate('projects.dsmj')
                .populate('projects.task.createdBy')
                .populate('projects.task.user')
                .populate('projects.task.comments.user')
                .sort({ createdAt: -1});
                return sprintData
                
              }catch(err){
                console.log(err,'err')
                logger('sprint',`Sprint list: Problem in getting sprint data: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in getting sprint data', 500);
              }
            },
            /**
             * List sprints 
             * @author Yamin
             * @param {args, context} 
             */
            activeSprint: async(args,context) =>{
              await authMiddleware(context)
              try{
                //console.log(ISODate(new Date()),'dagte')
                const currentDate = new Date().toISOString()
                const sprintData = await Sprint.findOne({endDate: { $gt: currentDate}, startDate: { $lt: currentDate}})
                .populate('createdBy')
                .populate('projects.po')
                .populate('projects.spo')
                .populate('projects.smj')
                .populate('projects.dsmj')
                .populate('projects.task.createdBy')
                .populate('projects.task.user')
                .populate('projects.task.comments.user');  
                return sprintData
                
              }catch(err){
                console.log(err,'err')
                logger('sprint',`Sprint list: Problem in getting sprint data: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in getting sprint data', 500);
              }
            }
            
            
}

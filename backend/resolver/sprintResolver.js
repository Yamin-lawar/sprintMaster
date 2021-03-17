const Sprint = require('../models/sprint') 
const Project = require('../models/project') 
const Team = require('../models/team') 
const User = require('../models/user') 
import {logger, customErrorHandler, validationErrorResponse} from '../utils/general'
import { createSprintValidation, addUpdateTaskValidation, updateTaskStatusValidation, updateSprintValidation,  deleteSprintValidation, updateProjectRankingValidation, addCommentValidation, updateCommentValidation, deleteCommentValidation} from '../validations/validator'
import authMiddleware from '../middlewares/auth'
import user from '../models/user'
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
                    console.log(currentDate<new Date(startDate))
                    if(currentDate<new Date(startDate)){
                      sprintStatus = 'Pending'
                    }else if(currentDate>new Date(endDate)){
                      sprintStatus = 'Completed'
                    }else if(currentDate>=new Date(startDate)){
                      sprintStatus = 'Active'
                    }
                    const createSprint = new Sprint({
                      name: name,
                      code: code,
                      startDate: startDate,
                      endDate: endDate,
                      hours: sprintHours,
                      createdBy: createdBy,
                      status: sprintStatus,
                      projects: projectArray
                    });

                    await createSprint.save()
                    return {message: "Sprint created successfully"}

                 }catch(err){
                       logger('sprint',`Create Sprint: Problem in adding sprint: ${err}`);
                       throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in adding sprint', 500);
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
                    let userHourArray = []
                    for(let i = 0; i< tasksData.tasks.length; i++){
                      let taskArray = tasksData.tasks[i]
                    //tasksData.tasks.map(async (taskArray,index)=>{
                      totalCompletion += taskArray.completion ? taskArray.completion : 0
                      const hours = await Sprint.aggregate([
                        { $match: { "_id":  ObjectID(tasksData.sprintId)} },
                        {
                          "$unwind": "$projects"
                        },
                        {
                          "$unwind": "$projects.task"
                        },
                        { $match: { "projects._id": {$ne: ObjectID(tasksData.projectId)} } },
                        { $match: { "projects.task.user": ObjectID(taskArray.user) } },
                        { $group: { _id : null, hours : { $addToSet: '$hours' }, sum : { $sum: "$projects.task.hours" } } }
                      ])
                      const nextCount = typeof userHourArray[taskArray.user] == "undefined" ?  0 : userHourArray[taskArray.user] 
                      userHourArray[taskArray.user] = nextCount + taskArray.hours
                      if(hours.length > 0 && hours[0].sum + userHourArray[taskArray.user] > hours[0].hours){
                        throw customErrorHandler('Some user already consumed in other project, please check your data', 500);
                      }
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
                      
                    }
                    const completionRate = totalCompletion/tasksData.tasks.length
                    if(taskDataInput.length == 0){
                       throw customErrorHandler("Problem in adding task",500)
                    }
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
                    logger('sprint',`Update Task: Problem in updating task: ${err}`);
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
                 /* const sprintData = await Sprint.findOne({
                    "_id" : tasksData.sprintId, 
                    "projects._id" : tasksData.projectId
                  })*/
                  const sprintData =await Sprint.findOne(
                    {
                      "_id" : tasksData.sprintId, 
                    "projects._id" : tasksData.projectId
                    }, 
                    {projects: {$elemMatch: {_id: tasksData.projectId}}});
                 
                  console.log(sprintData,'sprintData',sprintData.projects[0].task)
                  let projectCompletion = 0;
                    ///get project and update its completion
                    if(sprintData.projects[0].task.length > 0){
                      sprintData.projects[0].task.map((taskData) => {
                        console.log(taskData,'taskData')
                        projectCompletion += taskData.completion
                        
                    })
                    }
                  projectCompletion = projectCompletion/sprintData.projects[0].task.length  
                  console.log(projectCompletion,'projectCompletion')
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
                  logger('sprint',`Update Task status: Problem in updating task status: ${err}`);
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
                    $set: {name: name, code: code, startDate: startDate, endDate: endDate, hours: sprintHours}
                  } 
                )
                return {message: "Sprint updated successfully"}
              }catch(err){
                logger('sprint',`Update sprint: Problem in updating sprint: ${err}`);
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
                logger('sprint',`Delete sprint: Problem in deleting sprint: ${err}`);
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
                //format manual response as we need to manipulate response for allocated user list together 
                let finalResponse = []
                finalResponse._id = sprintData._id
                finalResponse.name = sprintData.name
                finalResponse.code = sprintData.code
                finalResponse.deleted = sprintData.deleted
                finalResponse.startDate = sprintData.startDate
                finalResponse.endDate = sprintData.endDate
                finalResponse.status = sprintData.status
                finalResponse.sprintHours = sprintData.sprintHours
                finalResponse.createdAt = sprintData.createdAt
                finalResponse.updatedAt = sprintData.updatedAt
                finalResponse.createdBy = sprintData.createdBy
                finalResponse.hours = sprintData.hours
                finalResponse.completion = sprintData.completion
                let projectResponse = [];
                sprintData.projects.map(async (sprintProjectData,index) => {
                  let projectSubObject = {}
                  let allocatedUser = [];
                  sprintProjectData.task.forEach(function(taskDetail) {
                     allocatedUser.push(taskDetail.user)
                  })
                  projectSubObject._id = sprintProjectData._id
                  projectSubObject.name = sprintProjectData.name
                  projectSubObject.code = sprintProjectData.code
                  projectSubObject.completion = sprintProjectData.completion
                  projectSubObject.task = sprintProjectData.task
                  projectSubObject.allocatedUsers = allocatedUser
                  projectSubObject.smj = sprintProjectData.smj
                  projectSubObject.dsmj = sprintProjectData.dsmj
                  projectSubObject.po = sprintProjectData.po
                  projectSubObject.spo = sprintProjectData.spo
                  projectSubObject.poRanking = sprintProjectData.poRanking
                  projectSubObject.gurujiRanking = sprintProjectData.gurujiRanking
                  projectResponse.push(projectSubObject)
                })
                finalResponse.projects = projectResponse
                return finalResponse
              }catch(err){
                logger('sprint',`Sprint list: Problem in getting sprint data: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in getting sprint data', 500);
              }
            },
            /**
             * List users with reamining hours
             * @author Yamin
             * @param {args, context} 
             */
            userHours: async(args,context) =>{
              await authMiddleware(context)
              try{
                  //get all users
                  const userDataArray = await User.find().sort({ firstName: 1});
                  //get total sprint hours 
                  const sprintTotalHours = await Sprint.findOne({_id: ObjectID("5fb2184953675d5409b6c8e8")},{hours:1})
                  let userArray = [];
                      for(let j=0; j<userDataArray.length; j++){
                            //count total hours consumed for user in sprint
                            const hours = await Sprint.aggregate([
                              { $match: { "_id": ObjectID(args._id) } }, 
                              {
                                "$unwind": "$projects"
                              },
                              {
                                "$unwind": "$projects.task"
                              },
                              { $match: { "projects.task.user": ObjectID(userDataArray[j]._id) } },
                              { $group: { _id : null, hours : { $addToSet: '$hours' }, sum : { $sum: "$projects.task.hours" } } }
                            ])
                            if(hours.length > 0){
                              //if hours consumed then substract from total hours and append in user object
                              let hoursObject = {
                                "hoursLeft": hours[0].hours - hours[0].sum
                              }
                              let userDataObject = userDataArray[j]._doc
                              userArray[j] = {...hoursObject, ...userDataObject}
                             
                            }else{
                              let hoursObject = {
                                "hoursLeft": sprintTotalHours.hours
                              }
                              let userDataObject = userDataArray[j]._doc
                              userArray[j] = {...hoursObject, ...userDataObject}
                            }
                      }//end user loop
                return userArray
                
              }catch(err){
                logger('sprint',`Sprint user hour list: Problem in getting sprint users hours data: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in getting users', 500);
              }
            }
            
}


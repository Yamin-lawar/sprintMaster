const Sprint = require('../models/sprint') 
const Project = require('../models/project') 
import {logger, customErrorHandler, validationErrorResponse} from '../utils/general'
import { createSprintValidation } from '../validations/validator'
import authMiddleware from '../middlewares/auth'
const mongoose = require('mongoose');
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
                    console.log(projectArray,'projectArray')
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

                 }catch(err){
                       console.log(err,'err')
                       logger('project',`Create Project: Problem in adding project: ${err}`);
                       throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in adding project', 500);
                 }    
            }, 
            
           
}


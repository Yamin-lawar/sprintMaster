const Team = require('../models/team')  
import {logger, customErrorHandler, validationErrorResponse} from '../utils/general'
import { createTeamValidation, updateTeamValidation, removeTeamValidation} from '../validations/validator'
import authMiddleware from '../middlewares/auth'
module.exports = {
            /**
             * get all teams (Query)
             * @author Yamin
             */
            teams: async(args, context) =>  {
                console.log('jo')
                await authMiddleware(context)
                try{
                    let queryCondition = {};
                    if(typeof args.id !== "undefined"){
                      queryCondition = {_id: args.id}
                    }
                    const teamData = await Team.find(queryCondition);
                    if(teamData !== null && teamData.length > 0){
                        return teamData;
                    }else{
                       return [];
                    }
                }catch(err){
                  console.log(err,'err')
                  logger('team',`Get Team: Problem in getting all team: ${err}`);
                  throw customErrorHandler('Problem in getting team list', 500);
                }
                
            },
            /**
             * Create team (Mutation)
             * @author Yamin
             * @param args
             */
            createTeam: async(args,context) => {
                await authMiddleware(context)
                try{
                    const checkResponse = createTeamValidation.validate(args.input);
                    if(checkResponse.error !== undefined){
                      return validationErrorResponse(checkResponse.error)
                    }
                    //check same team avail or not 
                    const teamExist = await Team.findOne({name: args.input.name});
                    console.log(teamExist,'teamExist')
                    if(teamExist !== null){
                      throw customErrorHandler('Team already exist, enter different name', 500);
                    }
                    const team = new Team({
                      name: args.input.name,
                      skills: args.input.skills
                    });
                    return team.save().then(result => {
                        return {team: result._doc}
                    }).catch(err => {
                      logger('team',`Create Team: Problem in adding team: ${err}`);
                      throw customErrorHandler('Problem in adding team', 500);
                    });

                 }catch(err){
                       logger('team',`Create Team: Problem in adding team: ${err}`);
                       throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in adding team', 500);
                 }    
            }, 
            /**
             * Update team (Mutation)
             * @author Yamin
             * @param args, context
             */
            updateTeam: async(args, context) => {
              
              authMiddleware(context)
              try{
                const checkResponse = updateTeamValidation.validate(args.input);
                if(checkResponse.error !== undefined){
                  return validationErrorResponse(checkResponse.error)
                }
                const teamUpdate = await Team.update({_id:args.input._id},{$set: {name: args.input.name, skills: args.input.skills}});
                console.log(teamUpdate,'teamUpdate')
                if(teamUpdate.nModified == 0){
                  logger('team',`Update Team: Problem in updating team: ${args.input._id}`);  
                  throw customErrorHandler('Problem in updating team', 500);  
                }
                const teamData = await Team.findOne({_id:args.input._id});
                return {team: teamData}
              }catch(err){
                logger('team',`Update Team: Problem in updating team: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in updating team', 500);   
              }
            },
            /**
             * Remove team (mutatuion)
             * @author Yamin
             * @params args context
             */
            removeTeam: async(args, context) =>{
              authMiddleware(context)
              const checkResponse = removeTeamValidation.validate(args.input);
              if(checkResponse.error !== undefined){
                return validationErrorResponse(checkResponse.error)
              }
              try{
                const deleteTeam = await Team.delete({_id: args.input._id})
                if(deleteTeam.deletedCount == 0){
                    throw customErrorHandler('Problem in removing team', 500);
                }
                return {message: "Team removed successuflly"}
              }catch(err){
                logger('team',`Remove Team: Problem in removing team: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in removing team', 500);   
              }                
            }
}


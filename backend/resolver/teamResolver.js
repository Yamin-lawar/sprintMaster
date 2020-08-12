const Team = require('../models/team')  
import {logger, customErrorHandler, validationErrorResponse} from '../utils/general'
import { createTeamValidation } from '../validations/validator'
import authMiddleware from '../middlewares/auth'
module.exports = {
            /**
             * get all teams (Query)
             * @author Yamin
             */
            teams: async(args, context) =>  {
                await authMiddleware(context)
                //console.log('here')
                try{
                    return Team.find({}, function(err, result) {
                        if (err) {
                          logger('team',`Get Team: Problem in getting all team: ${err}`);
                          throw customErrorHandler('Problem in getting team list', 500);
                        } else {
                          return result;
                        }
                      });
                }catch(err){
                  logger('team',`Get Team: Problem in getting all team: ${err}`);
                  throw customErrorHandler('Problem in getting team list', 500);
                }
                
            },
            /**
             * Create team (Mutation)
             * @author Yamin
             * @param args
             */
            createTeam: async(args) => {
                try{
                    await authMiddleware(context)
                    const checkResponse = createTeamValidation.validate(args.input);
                    if(checkResponse.error !== undefined){
                      return validationErrorResponse(checkResponse.error)
                    }
                    //check same team avail or not 
                    const teamExist = Team.findOne({name: args.input.name});
                    if(teamExist && teamExist.length > 0){
                      throw customErrorHandler('Team already exist, please enter different name', 500);
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
                       throw customErrorHandler('Problem in adding team', 500);
                 }    
        }, 
}


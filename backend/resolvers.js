const Team = require('./models/team')  
const { GraphQLScalarType } = require('graphql') ;
const generalFunctions = require('./utils/general')
import {logger, customErrorHandler} from './utils/general'


const resolvers = {
        Query:{   
            /**
             * get all teams
             * @author Yamin
             */
            teams: () => {
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
                
            }
            
        },
        Mutation: {
            /**
             * Create team 
             * @author Yamin
             * @param args
             */
            createTeam: (_,args) => {
                try{
                    const team = new Team({
                        name: args.input.name,
                        skills: args.input.skills
                    });

                    return team.save().then(result => {
                        return {...result._doc}
                    }).catch(err => {
                       logger('team',`Create Team: Problem in adding team: ${err}`);
                       throw customErrorHandler('Problem in adding team', 500);
                    });
                 }catch(err){
                       logger('team',`Create Team: Problem in adding team: ${err}`);
                       throw customErrorHandler('Problem in adding team', 500);
                 }    
             
            }
        }, 
        /**
         * Custom scalar for date
         * @author Yamin
         */
        Date: new GraphQLScalarType({
            name: 'Date',
            description: 'Custom date scalar',
            parseValue(value) {
              return value;
            },
            serialize(value) {
              return new Date(Number(value));
            },
            parseLiteral(ast) {
              if (ast.kind === Kind.INT) {
                return new Date(ast.value);
              }
              return null;
            }
          })
        
}
module.exports = {resolvers}



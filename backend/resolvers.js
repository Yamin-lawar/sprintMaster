const Team = require('./models/team')  
import User from './models/user'
const { GraphQLScalarType } = require('graphql') ;
import {logger, customErrorHandler, validationErrorResponse} from './utils/general'
import { createTeamValidation, createUserValidation } from './validations/validator'
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');

module.exports = {
        
            /**
             * get all teams
             * @author Yamin
             */
            teams: () => {
               
                try{
                  console.log('old team query')
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
             * get all teams
             * @author Yamin
             */
            users: async() => {
              try{
                  const userList = await User.find().populate('team');
      
                  return userList;
              }catch(err){
                logger('user',`Get User: Problem in getting all user: ${err}`);
                throw customErrorHandler('Problem in getting user list', 500);
              }
              
          },
            
        
       
            /**
             * Create team 
             * @author Yamin
             * @param args
             */
            createTeam: async(args) => {
               console.log(createTeamValidation,'createTeamValidation')
                try{
                    const schema = Joi.object({
                      name: Joi.string().required()
                    })
                    const checkResponse = createTeamValidation.validate(args.input);
                    if(checkResponse.error !== undefined){
                      return validationErrorResponse(checkResponse.error)
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
                        console.log(err,'err')
                       logger('team',`Create Team: Problem in adding team: ${err}`);
                       throw customErrorHandler('Problem in adding team', 500);
                 }    
             
            },
            /**
             * Create User 
             * @author Yamin
             * @param args
             */
            createUser: async(_,args) => {
              console.log('createUser')
              try{
                  //form validation
                  const checkResponse = createUserValidation.validate(args.input);
                  if(checkResponse.error !== undefined){
                    return validationErrorResponse(checkResponse.error)
                  }
                  //check for existing user
                  const email = args.input.email
                  const userExist = await User.find({email: email.toLowerCase()});
                  if(userExist.length >= 1){
                    return customErrorHandler('This email is already register', 409);
                  }
                  //encypt password before adding in db
                  const encPassword = await bcrypt.hash(args.input.password, 16);
                  const user = new User({
                      firstName: args.input.firstName,
                      lastName: args.input.lastName,
                      password: encPassword,
                      email: email.toLowerCase(),
                      skills: args.input.skills,
                      mobileNo: args.input.mobileNo,
                      avtaar: args.input.avtaar,
                      team: args.input.team
                  });

                  return user.save().then(result => {
                      return {user: result._doc}
                  }).catch(err => {
                     logger('user',`Create User: Problem in adding user: ${err}`);
                     throw customErrorHandler('Problem in adding user', 500);
                  });
               }catch(err){
                    logger('user',`Create User: Problem in adding user: ${err}`);
                    throw customErrorHandler('Problem in adding user', 500);
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



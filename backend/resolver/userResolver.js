import User from '../models/user'
import {logger, customErrorHandler, validationErrorResponse} from '../utils/general'
import { createTeamValidation, createUserValidation } from '../validations/validator'
const bcrypt = require('bcrypt');
const { GraphQLScalarType } = require('graphql') ;


module.exports = {
             /**
             * get all teams
             * @author Yamin
             */
            users: async() => {
              try{
                  const userList = await User.find().populate('team');
                  console.log(userList,'userList')
                  return userList;
              }catch(err){
                logger('user',`Get User: Problem in getting all user: ${err}`);
                throw customErrorHandler('Problem in getting user list', 500);
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
           
          }
        
  
      
        
}



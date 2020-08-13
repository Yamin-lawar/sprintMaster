import User from '../models/user'
import Token from '../models/token'
import {logger, customErrorHandler, validationErrorResponse} from '../utils/general'
import { createUserValidation } from '../validations/validator'
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


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
            createUser: async(args) => {
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
           * Login function for user, will return user detail
           * @author Yamin
           * @params input
           */
          login: async(args, context) => {
              try{
                console.log(context.request.headers.authorization,'auth')
                //form validation
                const {email, password} = args.input;
                console.log(email)
                //check email is exist 
                const emailExist = await User.findOne({email: email});
                if(emailExist == null){
                  return customErrorHandler('Email address is not found', 404);
                }
                //match password
                const passwordCheck = await bcrypt.compare(password, emailExist.password)
                if(!passwordCheck){
                  return customErrorHandler('Please enter right password', 500); 
                }
                const jwtPayload = {
                  id: emailExist._id,
                  name: emailExist.firstName,
                  sureName: emailExist.lastName,
                  avtaar: emailExist.avtaar,
                  mobileNo: emailExist.mobileNo,
                  team: emailExist.team
                }
                console.log(process.env.JWT_KEY,'token')
                const token = await jwt.sign(jwtPayload, process.env.JWT_KEY.replace(/\\n/gm, '\n'), { 
                  algorithm: 'HS256',
                  expiresIn: '7d' 
                })
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 7);
                const tokenPayload = new Token({
                  user: emailExist._id,
                  token: token,
                  expiredAt: expireDate,
                });
                const TokenSave = tokenPayload.save();
                if(!TokenSave){
                  logger('user',`Login: Problem in adding token`);
                  return customErrorHandler('Problem in login, Please try again', 500);
                }
                return {
                  user: emailExist,
                  token: token
                }
               
             }catch(err){
                  console.log(err);
                  logger('user',`Login: Problem in login: ${err}`);
                  throw customErrorHandler('Problem in login, Please try again', 500);
             }    
        }

        
  
      
        
}



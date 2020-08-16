const User = require('../models/user') 
import Token from '../models/token'
import {logger, customErrorHandler, validationErrorResponse, sendEmail} from '../utils/general'
import { createUserValidation, updateUserValidation,removeUserValidation, changePasswordValidation, forgotPasswordValidation } from '../validations/validator'
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var crypto = require("crypto-js");
import authMiddleware from '../middlewares/auth'

module.exports = {
             /**
             * get all teams
             * @author Yamin
             */
            users: async(args, context) => {
              authMiddleware(context)
              try{
                  let queryCondition = {};
                  if(typeof args._id !== "undefined"){
                    queryCondition = {_id: args._id}
                  }else if(typeof args.team !== "undefined"){
                    queryCondition = {team: args.team}
                  }
                  const userList = await User.find(queryCondition).populate('team');
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
                  const password = await crypto.AES.encrypt(JSON.stringify(args.input.email), process.env.CRYPTO_KEY).toString()
                  const encPassword = await bcrypt.hash(password, 16);
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

                  return user.save().then(async result => {
                      const url = process.env.WEB_URL
                      const {firstName, lastName, email} = result
                      let emailBody = `Dear ${firstName} ${lastName},<br><br>`;
                        emailBody = `${emailBody} You have invited to use sprint master, Here is your credential: <br/>`;
                        emailBody = `${emailBody} email: ${email}<br/>`;
                        emailBody = `${emailBody} password: ${password}<br/><br/>`;
                        emailBody = `${emailBody} url: ${url}<br/><br/>`;
                        emailBody = `${emailBody} You can always change your password from inside app!! Enjoy sprint master.<br/> If you face any difficulty in login contact us on ${process.env.EMAIL_ID}<br/><br/>`;
                        emailBody = `${emailBody} Regards  <br/>Sprint Master`;
                        const emailSent = await sendEmail(email,'Welcome to sprint master',emailBody);
                        if(!emailSent){
                          logger('user',`Create User: Problem in adding user`);  
                          throw customErrorHandler('Problem in adding user', 500); 
                        }
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
             * Update User detail 
             * @author Yamin
             * @param args
             */
            updateUser: async(args,context) => {
              authMiddleware(context)
              try{
                  const checkResponse = updateUserValidation.validate(args.input);
                  if(checkResponse.error !== undefined){
                    return validationErrorResponse(checkResponse.error)
                  }
                  const {_id, firstName, lastName, skills, mobileNo, avtaar, team} = args.input
                  const userpdate = await User.update({_id:_id},{$set: {
                      firstName: firstName, 
                      lastName: lastName,
                      skills:skills,
                      mobileNo: mobileNo,
                      avtaar: avtaar,
                      team: team
                  }});
                  if(userpdate.nModified == 0){
                    logger('team',`Update User: Problem in updating user detail: ${_id}`);  
                    throw customErrorHandler('Problem in updating user', 500);  
                  }
                  const userData = await User.findOne({_id:_id});
                  return {user: userData}
               }catch(err){
                    logger('user',`Update User: Problem in updating user: ${err}`);
                    throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in updating user', 500);   
               }    
           
          },
           /**
             * Remove user (mutatuion)
             * @author Yamin
             * @params args context
             */
            removeUser: async(args, context) =>{
              authMiddleware(context)
              const checkResponse = removeUserValidation.validate(args.input);
              if(checkResponse.error !== undefined){
                return validationErrorResponse(checkResponse.error)
              }
              try{
                const deleteUser = await User.delete({_id: args.input._id})
                if(deleteUser.deletedCount == 0){
                    throw customErrorHandler('Problem in removing user', 500);
                }
                return {message: "User removed successuflly"}
              }catch(err){
                logger('team',`Remove User: Problem in removing user: ${err}`);
                throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in removing user', 500);   
              }                
            },
          /**
           * Login function for user, will return user detail
           * @author Yamin
           * @params input
           */
          login: async(args, context) => {
              try{
                //form validation
                const {email, password} = args.input;
                console.log(email)
                //check email is exist 
                const emailExist = await User.findOne({email: email.toLowerCase()});
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
                  logger('user',`Login: Problem in login: ${err}`);
                  throw customErrorHandler('Problem in login, Please try again', 500);
             }    
        },
        /**
         * Change password API
         * @author Yamin
         * args, context
         */
        changePassword: async(args,context) => {
          authMiddleware(context)
          try{
            const {_id, oldPassword, newPassword, confirmPassword} = args.input
            const checkResponse = changePasswordValidation.validate(args.input);
            console.log(checkResponse.error,'checkResponse.error')
            if(checkResponse.error !== undefined){
              return validationErrorResponse(checkResponse.error)
            }
            const userDetail = await User.findOne({_id:_id})
            if(userDetail == null){
              logger('user',`Change password: user not found with id ${id}`);
              return customErrorHandler('We are not able to find your detail', 500); 
            }
            const passwordCheck = await bcrypt.compare(oldPassword, userDetail.password)
            if(!passwordCheck){
                return customErrorHandler('Please enter right old password', 500); 
            }
            const encPassword = await bcrypt.hash(newPassword, 16);
            const passwordUpdate = await User.update({_id:_id},{$set: {
              password: encPassword, 
            }});
            if(passwordUpdate.nModified == 0){
              logger('team',`Change password: Problem in updating password: ${_id}`);  
              throw customErrorHandler('Problem in changing password, Please try again', 500);  
            }
            return {message: "Your password updated successfully"}
          }catch(err){
            logger('user',`Change password: Problem in changing password: ${err}`);
            throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in changing password, Please try again', 500);
          }  
        },
        /**
         * Forgot password API
         * @author Yamin
         * @param args,context
         */
        forgotPassword: async(args,context) => {
          try{
            const checkResponse = forgotPasswordValidation.validate(args.input);
            if(checkResponse.error !== undefined){
              return validationErrorResponse(checkResponse.error)
            }
            const userEmailExist = await User.findOne({email:args.input.email.toLowerCase()})
            console.log(userEmailExist,'userEmailExist')
            if(userEmailExist == null){
              throw customErrorHandler("Email doesn't exist in system, Please use correct email", 500);
            }
            const token = encodeURIComponent(crypto.AES.encrypt(JSON.stringify(args.input.email), process.env.CRYPTO_KEY).toString());
            const date = new Date();
            date.setDate(date.getDate() + 2);
            console.log(token,date,'token,date')
            const updateTokenToUser = await User.updateOne({email:args.input.email},{$set: {
              passwordtoken: token, 
              passwordTokenExpiresIn: date
            }})
            if(updateTokenToUser.nModified == 0){
              logger('user',`Forgot password: Problem in update token detail: ${_id}`);  
              throw customErrorHandler('Problem in reseting password, Please try again', 500);  
            }
            const url = process.env.WEB_URL+"/reset-password/?token="+token
            const {firstName, lastName, email} = userEmailExist
            let emailBody = `Dear ${firstName} ${lastName},<br><br>`;
                emailBody = `${emailBody} You have requested to reset your password, Please click on below url to reset you password: <br/>`;
                emailBody = `${emailBody} ${url}<br/><br/>`;
                emailBody = `${emailBody} If you face any difficulty in reseting password contact us on ${process.env.EMAIL_ID}<br/><br/>`;
                emailBody = `${emailBody} Regards  <br/>Sprint Master`;
                const emailSent = await sendEmail(email,'Reset your password',emailBody);
                if(!emailSent){
                  logger('user',`Forgot password: Problem in sending email`);  
                  throw customErrorHandler('Problem in reseting password, Please try again', 500); 
                }
                return {message: "We have sent you a link to reset your password on you email address"}
                
          }catch(err){
            console.log(err)
            logger('user',`Forgot password: Problem in forgot password: ${err}`);
            throw customErrorHandler(err.name == 'customError' ? err.message :  'Problem in reseting password, Please try again', 500);
          }  
        }

        
  
      
        
}



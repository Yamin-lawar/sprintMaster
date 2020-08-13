import {customErrorHandler} from '../utils/general'
var jwt = require('jsonwebtoken');
module.exports = (context) => {
    if(!context.request.headers.authorization){
        throw Error('Unauthorised', 401);
    }
    const token = context.request.headers.authorization.split(' ')[1]
    if(!token || token === ''){
        throw Error('Unauthorised', 401);
    }
    let decodeToken;
    try{
        decodeToken = jwt.verify(token, process.env.JWT_KEY)
        context.request.currentUser = decodeToken
    }catch(err){
        throw Error('Unauthorised', 401);
    }
}
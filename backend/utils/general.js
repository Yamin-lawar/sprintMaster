exports.logger = (fileName, err)=>{
    const opts = {
            errorEventName:'error',
            logDirectory:'./logs/', // NOTE: folder must exist and be writable...
            fileNamePattern:`roll-${fileName}-<DATE>.log`,
            dateFormat:'YYYY.MM.DD'
    };
    const log = require('simple-node-logger').createRollingFileLogger( opts );
    log.fatal(err)
    return true
}

/**
 * Custom error handler common function
 * @author Yamin
 * @param {*} message 
 * @param {*} code 
 */
exports.customErrorHandler = (message, code)=>{
    let e = new Error(message); 
    e.name = 'customError';
    e.code = code;
    return e
}

/**
 * Custom function for validation error response
 * @auuthor Yamin
 * @param {*} err 
 */
exports.validationErrorResponse = (err) => {
      return {
        error:[{
            name: err.details[0].path[0],
            message: err.details[0].message
        }]
      }
}

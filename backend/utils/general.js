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

exports.customErrorHandler = (message, code)=>{

    let e = new Error('Problem in adding user'); 
    e.name = 'customError';
    e.code = code;
    return e
}

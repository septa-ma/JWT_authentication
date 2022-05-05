const winston = require('winston');
const appRoot = require('app-root-path');


const options = {
    //settings transports.File
    FileInfo: {
        level: "info",
        filename: `${appRoot}/logs/info.log`,
        handleExceptions: true,
        format: winston.format.combine(winston.format.timestamp(),winston.format.json()),
        maxsize: 5000000, //5MB
        maxFile: 5,
    },

    FileErr: {
        level: "error",
        filename: `${appRoot}/logs/error.log`, 
        handleExceptions: true,
        format: winston.format.combine(winston.format.timestamp(),winston.format.json("errors")),
        maxsize: 5000000, //5MB
        maxFile: 5,
        
    },

    // settings transports.Console
    console: {
        level: "debug", // 
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()   
        )
    }
} 

const Logger = new winston.createLogger({
    transports: [
        new winston.transports.File(options.FileInfo), //  Write all logs with level `info` and below to `app.log`
        new winston.transports.File(options.FileErr), //  Write all logs with level `info` and below to `app.log`
       new winston.transports.Console(options.console) //show debugs in console with level `debug`
    ],
    exitOnError: false, // if have an Error,don't Exit winston
});

// store morgan respone in a file
Logger.stream = {
    write: function (message) {
        Logger.info(message);
    },
};

module.exports = Logger;


var winston = require('winston');

var logger = winston.createLogger({
  format: winston.format.json(),
  level: 'info',
  transports: [
   new (winston.transports.Console)({ json: false, timestamp: true }),
   new winston.transports.File({ filename: __dirname + '/debug.log', json: false})
 ],
 exceptionHandlers: [
   new (winston.transports.Console)({ json: false, timestamp: true }),
   new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false})
 ],
 exitOnError: false
});

module.exports = logger;


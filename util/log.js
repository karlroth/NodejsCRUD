var winston = require('winston');

var logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
   new (winston.transports.Console)({ json: false, timestamp: true }),
   new winston.transports.File({ filename: __dirname + '/debug.log', json: false, level: 'info'})
 ],
 exceptionHandlers: [
   new (winston.transports.Console)({ json: false, timestamp: true }),
   new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false, level: 'error' })
 ],
 exitOnError: false
});

module.exports = logger;


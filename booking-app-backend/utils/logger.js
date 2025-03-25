 // utils/logger.js


 const winston = require('winston');
 require('winston-daily-rotate-file');
 
 const transport = new winston.transports.DailyRotateFile({
   filename: 'logs/booking-app-%DATE%.log',
   datePattern: 'YYYY-MM-DD',
   zippedArchive: true,
   maxSize: '20m',
   maxFiles: '14d'
 });
 
 const logger = winston.createLogger({
   level: 'info',
   format: winston.format.combine(
     winston.format.timestamp(),
     winston.format.json()
   ),
   transports: [
     transport,
     new winston.transports.Console({
       format: winston.format.combine(
         winston.format.colorize(),
         winston.format.simple()
       )
     })
   ]
 });
 
 module.exports = logger;
 





























// const winston = require('winston');

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   defaultMeta: { service: 'booking-app' },
//   transports: [
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log' })
//   ]
// });

// //If not in production, log to the console
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.combine(
//       winston.format.timestamp(),
//       winston.format.simple()
//     )
//   }));
// }

// module.exports = logger;

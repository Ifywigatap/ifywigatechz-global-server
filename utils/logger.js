import winston from 'winston';
import path from 'path';
import fs from 'fs';
import 'winston-daily-rotate-file';
import util from 'util';

// Ensure logs directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, colorize, uncolorize } = winston.format;

// Define the custom log format
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    uncolorize(), // Ensure log files don't contain ANSI color codes
    customFormat
  ),
  transports: [
    // Write all logs with level 'error' and below with daily rotation
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true, // Compress old logs to save space
      maxSize: '20m', // Rotate file if it exceeds 20MB
      maxFiles: '14d' // Automatically delete logs older than 14 days
    }),
    // Write all logs with level 'info' and below with daily rotation
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }),
  ],
});

// Log to console in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(colorize(), customFormat),
  }));
}

// Override default console methods to pipe them through Winston
// This automatically saves all existing console.logs to your log files!
console.log = (...args) => logger.info(args.map(a => typeof a === 'object' ? util.inspect(a) : a).join(' '));
console.info = (...args) => logger.info(args.map(a => typeof a === 'object' ? util.inspect(a) : a).join(' '));
console.warn = (...args) => logger.warn(args.map(a => typeof a === 'object' ? util.inspect(a) : a).join(' '));
console.error = (...args) => logger.error(args.map(a => typeof a === 'object' ? util.inspect(a) : a).join(' '));

export default logger;
import path from 'path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf, colorize } = format;

const __dirname = path.resolve();

const customLogFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'node-app' }),
    timestamp(),
    colorize(),
    customLogFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, '/logs/error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join(__dirname, '/logs/app.log'),
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: path.join(__dirname, '/logs/exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: path.join(__dirname, '/logs/rejections.log'),
    }),
  ],
});

export default logger;

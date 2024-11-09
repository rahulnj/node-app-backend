import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, label, printf, colorize } = format;

const __dirname = path.resolve();
const logDirectory = path.join(__dirname, 'logs');

const logOptions = {
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '7d',
};

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
    new DailyRotateFile({
      filename: path.join(logDirectory, '%DATE%-error.log'),
      level: 'error',
      zippedArchive: true,
      ...logOptions,
    }),
    new DailyRotateFile({
      filename: path.join(logDirectory, '%DATE%-app.log'),
      zippedArchive: true,
      ...logOptions,
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDirectory, '%DATE%-exceptions.log'),
      ...logOptions,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDirectory, '%DATE%-rejections.log'),
      ...logOptions,
    }),
  ],
});

export default logger;

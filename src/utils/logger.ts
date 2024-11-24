/**
 * Logging Configuration and Setup
 *
 * - **Development Environment** (`NODE_ENV === 'development'`):
 *   - Logs are only output to the console.
 *   - No file logging is enabled.
 *
 * - **Production Environment** (`NODE_ENV !== 'development'`):
 *   - Logs are saved to daily rotated log files (`error.log`, `app.log`, `exceptions.log`, `rejections.log`).
 *   - Log files are rotated daily and archived when they exceed 20MB, with a retention period of 7 days.
 *   - All logs are compressed (`.gz`).
 *
 * - **Log Format**:
 *   - Includes a timestamp, log level, and message, with colorized output for development.
 *
 * - **Exception and Rejection Handlers**:
 *   - Handles uncaught exceptions and unhandled promise rejections, logging them to both console and files in production.
 **/

import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { APP_CONFIG } from '@Config/appConfig';

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

const isDevMode = APP_CONFIG.NODE_ENV === 'development';

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
    ...(!isDevMode
      ? [
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
        ]
      : []),
  ],
  exceptionHandlers: [
    new transports.Console(),
    ...(!isDevMode
      ? [
          new DailyRotateFile({
            filename: path.join(logDirectory, '%DATE%-exceptions.log'),
            ...logOptions,
          }),
        ]
      : []),
  ],
  rejectionHandlers: [
    new transports.Console(),
    ...(!isDevMode
      ? [
          new DailyRotateFile({
            filename: path.join(logDirectory, '%DATE%-rejections.log'),
            ...logOptions,
          }),
        ]
      : []),
  ],
});

export default logger;

import { createServer, Server } from 'node:http';
import express from 'express';
import cookiesParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { APP_CONFIG } from '@Config/appConfig';
import apiRouter from '@Routes/index';
import validateEnvVariables from '@Middlewares/envMiddlewares/envValidation';
import { logRequest } from '@Middlewares/loggerMiddlewares/logger';
import {
  errorHandler,
  notFoundHandler,
} from '@Middlewares/errorMiddlewares/errorHandlingMiddleware';

const app = express();

// Security middlewares
app.use(helmet());
// app.use(cors({ origin: APP_CONFIG.ALLOWED_ORIGINS }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Middleware
app.use(validateEnvVariables());
app.use(logRequest);
app.use(express.json());
app.use(cookiesParser());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', apiRouter);

// Error handlers
app.use([notFoundHandler, errorHandler]);

const server: Server = createServer(app);

export { app, server };

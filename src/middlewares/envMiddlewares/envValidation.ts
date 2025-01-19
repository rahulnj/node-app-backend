import { Request, Response, NextFunction } from 'express';
import logger from '@Utils/logger';

const REQUIRED_ENV_VARS = ['PORT', 'MONGO_URI', 'NODE_ENV', 'JWT_SECRET'];

const validateEnvVariables = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingVars = REQUIRED_ENV_VARS.filter(
      (variable) => !process.env[variable]
    );

    if (missingVars.length) {
      const error = new Error('Internal server error');
      logger.error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
      return next(error);
    }
    next();
  };
};

export default validateEnvVariables;

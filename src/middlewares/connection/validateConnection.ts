import { param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import logger from '@Utils/logger';
import { APP_CONFIG } from '@Config/appConfig';

const devMode = APP_CONFIG.NODE_ENV === 'development';

export const validateConnectionRequest = [
  param('userId')
    .isMongoId()
    .withMessage(
      `Invalid userId format.${
        devMode ? ' Must be a valid MongoDB ObjectId.' : ''
      }`
    ),

  param('status')
    .isIn(['ignored', 'interested', 'accepted', 'rejected'])
    .withMessage(
      `Invalid status.${
        devMode
          ? " Allowed values: 'ignored', 'interested', 'accepted', 'rejected'"
          : ''
      }`
    ),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { userId: connection } = req.params;
    const {
      user: { _id: user },
    } = req;

    if (user.toString() === connection) {
      logger.warn(
        `Connection request blocked: User (${user}) attempted to connect to themselves.`
      );
      res.status(400).json({
        message: 'Connection request cannot be sent to yourself.',
      });
      return;
    }

    next();
  },
];

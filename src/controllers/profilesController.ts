import { Request, Response, NextFunction } from 'express';
import logger from '@Utils/logger';
import { User } from '@Models/user';

export const getProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.query;
  try {
    logger.info(`Request started fetching profile details of ${userId}`);
    const userProfile = await User.findById(userId).exec();
    if (!userProfile) {
      logger.warn(`No user found for ID: ${userId}`);
      res.status(404).send('No user found');
      return;
    }
    logger.info(
      `Request completed successfully fetched profile details of ${userId}`
    );
    res.send(userProfile);
  } catch (error) {
    next(error);
  }
};

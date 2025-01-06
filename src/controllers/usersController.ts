import { Request, Response, NextFunction } from 'express';
import logger from '@Utils/logger';
import { User } from '@Models/user';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.query;
  const loggedInUserId = req.user._id;

  try {
    if (userId) {
      logger.info(`Request started fetching profile of user ID: ${userId}`);

      const userProfile = await User.findById(userId).exec();

      if (!userProfile) {
        logger.warn(`No user found for ID: ${userId}`);
        res.status(404).json({ message: 'No user found' });
        return;
      }

      logger.info(`Successfully fetched profile details of user ID: ${userId}`);
      res.status(200).json(userProfile);
      return;
    }

    logger.info('Request started fetching all user profiles');

    const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).exec();

    if (!allUsers.length) {
      logger.warn('No users found');
      res.status(404).json({ message: 'No users found' });
      return;
    }

    logger.info('Successfully fetched all user profiles');
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

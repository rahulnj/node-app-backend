import { Request, Response, NextFunction } from 'express';
import logger from '@Utils/logger';
import { User } from '@Models/user';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userIds } = req.query;
  const loggedInUserId = req.user._id;

  try {
    if (userIds) {
      const userIdArray = (userIds as string).split(',').map((id) => id.trim());
      logger.info(`Fetching users by IDs: ${userIds}`);
      const userProfiles = await User.find({
        _id: { $in: userIdArray },
      }).exec();

      if (!userProfiles.length) {
        logger.warn('No users found');
        res.status(404).json({ message: 'No user found' });
        return;
      }

      logger.info('Successfully fetched user profiles by IDs');
      res.status(200).json(userProfiles);
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

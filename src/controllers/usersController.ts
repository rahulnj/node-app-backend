import { Request, Response, NextFunction } from 'express';
import { User } from '@Models/user';
import logger from '@Utils/logger';

export const fetchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info('Request started fetching all users from the database');

    const users = await User.find();

    logger.info(`Request completed successfully fetched ${users.length} users`);

    res.send(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;

  logger.info('Request started creating a new user');

  try {
    const user = await User.create(body);
    logger.info(
      `Request completed user created successfully with ID: ${user._id}`
    );

    res.send(user);
  } catch (error) {
    next(error);
  }
};

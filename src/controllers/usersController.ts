import { Request, Response } from 'express';
import { User } from '@Models/user';
import logger from '@Utils/logger';

export const fetchUsers = async (req: Request, res: Response) => {
  try {
    logger.info('Request started fetching all users from the database');

    const users = await User.find();

    logger.info(`Request completed successfully fetched ${users.length} users`);

    res.send(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error occurred while fetching users: ${error.message}`);
      res
        .status(400)
        .send(`An error occurred while fetching users: ${error.message}`);
    } else {
      logger.error('An unknown error occurred while fetching users');
      res.status(400).send('An unknown error occurred while fetching users');
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { body } = req;

  logger.info('Request started creating a new user');

  const user = new User(body);
  try {
    await user.save();

    logger.info(
      `Request completed user created successfully with ID: ${user._id}`
    );

    res.send(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error occurred while creating user: ${error.message}`);
      res
        .status(400)
        .send(`An error occurred while creating the user: ${error.message}`);
    } else {
      logger.error('An unknown error occurred while creating user');
      res.status(400).send('An unknown error occurred while creating the user');
    }
  }
};

import { Request, Response, NextFunction } from 'express';
import { User } from '@Models/user';
import logger from '@Utils/logger';

export const fetchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('Request started fetching all users from the database');
  try {
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
  logger.info(`Request started creating a new use with email: ${body.email}`);
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

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  logger.info(`Request started user login with email: ${email}`);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.error(`User not found with email: ${email}`);
      res.status(404).send('Invalid credentials');
      return;
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      logger.error(`Password does not match for user with email: ${email}`);
      res.status(401).send('Invalid credentials');
      return;
    }

    logger.info('Request completed user login successfully');
    res.send('Login successfull');
  } catch (error) {
    next(error);
  }
};

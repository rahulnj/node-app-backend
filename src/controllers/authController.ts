import { Request, Response, NextFunction } from 'express';
import { User } from '@Models/user';
import logger from '@Utils/logger';
import { APP_CONFIG } from '@Config/appConfig';

export const authSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body } = req;
  logger.info(`Attempting to create a new user with email: ${body.email}`);

  try {
    const user = await User.create(body);
    logger.info(`User created successfully with ID: ${user._id}`);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const authSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    logger.info(`Login attempt for email: ${email}`);

    const user = await User.findOne({ email }).exec();
    if (!user) {
      logger.warn(`Invalid login attempt: No user found for email ${email}`);
      res.status(404).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      logger.warn(
        `Invalid login attempt: Incorrect password for email ${email}`
      );
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = await user.getJWT();

    logger.info(`JWT token generated for user: ${email}, expires in 1 hour`);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: APP_CONFIG.NODE_ENV === 'production',
      // sameSite: 'strict',
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};

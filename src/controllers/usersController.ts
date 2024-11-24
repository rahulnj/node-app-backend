import { Request, Response, NextFunction } from 'express';
import { User } from '@Models/user';
import logger from '@Utils/logger';
import { APP_CONFIG } from '@Config/appConfig';

export const userSignup = async (
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

export const userSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    logger.info(`Login attempt for email: ${email}`);

    const user = await User.findOne({ email }).exec();
    if (!user) {
      logger.warn(`Invalid login attempt: No user found for email ${email}`);
      res.status(404).send('Invalid credentials');
      return;
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      logger.warn(`Invalid login attempt: Incorrect password for ${email}`);
      res.status(401).send('Invalid credentials');
      return;
    }

    const token = await user.getJWT();

    logger.info(`JWT token generated for user: ${email}, expires in 1 hour`);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: APP_CONFIG.NODE_ENV === 'production',
    });
    res.status(200).send('Login successful');
  } catch (error) {
    next(error);
  }
};

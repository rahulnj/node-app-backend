import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '@Config/appConfig';
import logger from '@Utils/logger';
import { User } from '@Models/user';

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    logger.warn(
      `Access denied. No token provided for route: ${req.originalUrl}`
    );
    res.status(401).send('Access denied. No token provided');
    return;
  }

  try {
    const decoded = jwt.verify(authToken, APP_CONFIG.JWT_SECRET as string);
    const { _id } = decoded as { _id: string };
    const user = await User.findById(_id).exec();
    if (!user) {
      logger.warn(`Access denied. No user found for token: ${authToken}`);
      res.status(401).send('Access denied. Invalid token');
      return;
    }

    req.user = user as Iuser;
    next();
  } catch (error) {
    logger.error(
      `Invalid token for route: ${req.originalUrl}. Error: ${error}`
    );
    next(error);
  }
};

export default userAuth;

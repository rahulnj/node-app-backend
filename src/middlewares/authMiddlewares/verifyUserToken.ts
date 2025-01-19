import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { APP_CONFIG } from '@Config/appConfig';
import logger from '@Utils/logger';
import { User } from '@Models/user';

declare global {
  namespace Express {
    interface Request {
      user?: Iuser;
    }
  }
}

export const verifyUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authToken } = req.cookies;

    if (!authToken) {
      logger.warn(
        `Access denied. No token provided. Route: ${req.method} ${req.originalUrl}`
      );
      res.status(401).json({ message: 'Access denied. No token provided' });
      return;
    }

    const decoded = jwt.verify(
      authToken,
      APP_CONFIG.JWT_SECRET as string
    ) as JwtPayload;
    const userId = decoded?._id;

    if (!userId) {
      logger.warn(`Invalid token payload. Token: ${authToken}`);
      res.status(401).json({ message: 'Access denied. Invalid token' });
      return;
    }

    const user = await User.findById(userId).exec();

    if (!user) {
      logger.warn(`No user found for token. UserID: ${userId}`);
      res.status(401).json({ message: 'Access denied. Invalid token' });
      return;
    }

    req.user = user as Iuser;
    next();
  } catch (error) {
    logger.error(
      `Error verifying token. Route: ${req.method} ${req.originalUrl}. Error: ${error}`
    );
    next(error);
  }
};

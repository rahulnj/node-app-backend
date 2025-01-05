import { Connection } from '@Models/connection';
import { User } from '@Models/user';
import logger from '@Utils/logger';
import { Request, Response, NextFunction } from 'express';

export const createConnectionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { status, userId: connection } = req.params;
  const {
    user: { _id: user },
  } = req;

  logger.info(
    `Request started to create a connection request for user ${user} and connection ${connection}`
  );

  try {
    const existingConnection = await Connection.findOne({
      user,
      connection,
    }).exec();

    if (existingConnection) {
      logger.warn(
        `Connection request already exists between user ${user} and connection ${connection}`
      );
      res.status(400).json({
        message: 'Connection request already exists',
      });
      return;
    }

    const isConnectionUserExist = await User.findById(connection).exec();

    if (!isConnectionUserExist) {
      logger.warn(`Connection user not found for ID: ${connection}`);
      res.status(404).json({
        message: 'Connection user not found',
      });
      return;
    }

    const newConnection = new Connection({
      user,
      connection,
      status,
    });

    await newConnection.save();

    logger.info(
      `Request completed successfully to create a connection request for user ${user} and connection ${connection}`
    );
    res.status(201).json({
      message: 'Connection request created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getConnections = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    user: { _id: userId },
  } = req;

  logger.info(`Request started fetching connections for user ${userId}`);

  try {
    const connections = await Connection.find({ user: userId }).exec();
    logger.info(
      `Request completed successfully fetching connections for user ${userId}`
    );
    res.status(200).json(connections);
  } catch (error) {
    next(error);
  }
};

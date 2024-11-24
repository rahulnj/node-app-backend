import { Connection } from '@Models/connection';
import logger from '@Utils/logger';
import { Request, Response, NextFunction } from 'express';

export const createConnectionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status, id: connection } = req.params;
  const {
    user: { _id: user },
  } = req;
  logger.info(
    `Request started to create a connection request for user ${user} and connection ${connection}`
  );
  try {
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
) => {
  const {
    user: { _id: userId },
  } = req;
  logger.info(`Request started fetching connections for user ${userId}`);
  try {
    const connections = await Connection.findById(userId).exec();
    logger.info(
      `Request completed successfully fetching connections for user ${userId}`
    );
    res.send(connections);
  } catch (error) {
    next(error);
  }
};

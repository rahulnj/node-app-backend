import { Server } from 'node:http';
import { Server as SocketServer } from 'socket.io';
import logger from '@Utils/logger';
import { APP_CONFIG } from '@Config/appConfig';

const initializeSocket = (server: Server) => {
  const io = new SocketServer(server, {
    // cors: {
    //   origin: APP_CONFIG.ALLOWED_ORIGINS,
    //   methods: ['GET', 'POST'],
    // },
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on('disconnect', (reason) => {
      logger.info(`User disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};

export default initializeSocket;

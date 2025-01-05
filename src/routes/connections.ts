import { Router } from 'express';
import verifyUserToken from '@Middlewares/verifyUserToken';
import {
  createConnectionRequest,
  getConnections,
} from '@Controllers/connectionsController';

const router = Router();

router.get('/requests/recieved/:status?', verifyUserToken, getConnections);

router.post(
  '/requests/send/:status/:userId',
  verifyUserToken,
  createConnectionRequest
);

export default router;

import { Router } from 'express';

import verifyUserToken from '@Middlewares/verifyUserToken';
import { validateConnectionRequest } from '@Middlewares/connection/validateConnection';

import {
  createConnectionRequest,
  getConnections,
} from '@Controllers/connectionsController';

const router = Router();

router.get('/requests/recieved/:status?', verifyUserToken, getConnections);

router.post(
  '/requests/send/:status/:userId',
  verifyUserToken,
  validateConnectionRequest,
  createConnectionRequest
);

export default router;

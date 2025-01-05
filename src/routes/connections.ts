import { Router } from 'express';
import verifyUserToken from '@Middlewares/verifyUserToken';
import { createConnectionRequest } from '@Controllers/connectionsController';

const router = Router();

router.post(
  '/requests/send/:status/:userId',
  verifyUserToken,
  createConnectionRequest
);

export default router;

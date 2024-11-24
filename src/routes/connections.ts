import { Router } from 'express';
import verifyUserToken from '@Middlewares/verifyUserToken';
import { createConnectionRequest } from '@Controllers/connectionsController';

const router = Router();

router.post(
  '/requests/send/:status/:id',
  verifyUserToken,
  createConnectionRequest
);

export default router;

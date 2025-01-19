import { Router } from 'express';
import { getUsers } from '@Controllers/usersController';
import { verifyUserToken } from '@Middlewares/authMiddlewares/verifyUserToken';

const router = Router();

router.get('/', verifyUserToken, getUsers);

export default router;

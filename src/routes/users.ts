import express from 'express';
import { createUser, fetchUsers } from '@Controllers/usersController';

const router = express.Router();

router.get('/', fetchUsers);
router.post('/createUser', createUser);

export default router;

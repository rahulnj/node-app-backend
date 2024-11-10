import express from 'express';
import {
  createUser,
  fetchUsers,
  userLogin,
} from '@Controllers/usersController';

const router = express.Router();

router.get('/', fetchUsers);
router.post('/createUser', createUser);
router.post('/login', userLogin);

export default router;

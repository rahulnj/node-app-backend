import express from 'express';
import {
  createUser,
  fetchUsers,
  getUserProfile,
  userLogin,
} from '@Controllers/usersController';
import userAuth from '@Middlewares/authMiddleware';

const router = express.Router();

router.get('/', userAuth, fetchUsers);
router.post('/createUser', createUser);
router.post('/login', userLogin);
router.get('/profile', userAuth, getUserProfile);

export default router;

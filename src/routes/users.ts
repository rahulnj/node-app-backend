import express, { Request, Response } from 'express';
import { getUsers } from '../controllers/usersController';

const router = express.Router();

router.get('/', getUsers);

export default router;

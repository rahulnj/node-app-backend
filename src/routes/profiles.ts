import express from 'express';
import { getProfiles } from '@Controllers/profilesController';
import userAuth from '@Middlewares/authMiddleware';

const router = express.Router();

router.get('/', userAuth, getProfiles);

export default router;

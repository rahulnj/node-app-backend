import { Router } from 'express';
import { authSignin, authSignup } from '@Controllers/authController';

const router = Router();

router.post('/signin', authSignin);
router.post('/signup', authSignup);

export default router;

import { Router } from 'express';
import { userSignin, userSignup } from '@Controllers/usersController';

const router = Router();

router.post('/signin', userSignin);
router.post('/signup', userSignup);

export default router;

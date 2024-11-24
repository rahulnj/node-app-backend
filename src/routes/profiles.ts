import { Router } from 'express';
import { getProfiles } from '@Controllers/profilesController';
import verifyUserToken from '@Middlewares/verifyUserToken';

const router = Router();

router.get('/', verifyUserToken, getProfiles);

export default router;

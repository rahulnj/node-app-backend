import { Router } from 'express';

import authRouter from '@Routes/auth';
import profileRouter from '@Routes/profiles';
import connectionRouter from '@Routes/connections';

const apiRouter = Router();

apiRouter.use('/users', authRouter);
apiRouter.use('/profiles', profileRouter);
apiRouter.use('/connections', connectionRouter);

export default apiRouter;

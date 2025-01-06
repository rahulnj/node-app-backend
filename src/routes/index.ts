import { Router } from 'express';

import authRouter from '@Routes/auth';
import profileRouter from '@Routes/users';
import connectionRouter from '@Routes/connections';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', profileRouter);
apiRouter.use('/connections', connectionRouter);

export default apiRouter;

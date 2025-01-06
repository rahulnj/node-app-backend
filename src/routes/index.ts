import { Router } from 'express';

import authRouter from '@Routes/auth';
import userRouter from '@Routes/users';
import connectionRouter from '@Routes/connections';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/connections', connectionRouter);

export default apiRouter;

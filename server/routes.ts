import { Application } from 'express';
import authRouter from './api/controllers/auth/router';
import examRouter from './api/controllers/exam/router';
import questionRouter from './api/controllers/question/router';
import userRouter from './api/controllers/user/router';
import courseRouter from './api/controllers/course/router';
import candidateRouter from './api/controllers/candidate/router';
import clientRouter from './api/controllers/client/router';
import hidr8Router from './api/controllers/hidr8/router';

export default function routes(app: Application): void {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/exam', examRouter);
  app.use('/api/v1/question', questionRouter);
  app.use('/api/v1/user', userRouter);
  app.use('/api/v1/course', courseRouter);
  app.use('/api/v1/candidate', candidateRouter);
  app.use('/api/v1/client', clientRouter);
  app.use('/api/v1/hidr8', hidr8Router);
}

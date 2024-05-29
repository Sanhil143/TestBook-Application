import * as express from 'express';
import controller from './controller';
import {adminMiddle,commonMiddle} from '../../middlewares/jwt.middleware'

export default express
  .Router()
  .post('/createQuestion/:examId', adminMiddle,controller.createQuestion)
  .get('/getAllQuestionsbyExamId/:examId', commonMiddle,controller.getAllQuestionsbyExamId);

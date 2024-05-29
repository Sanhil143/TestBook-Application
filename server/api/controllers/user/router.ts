import * as expres from 'express';
import controller from './controller';
import {adminMiddle, commonMiddle} from '../../middlewares/jwt.middleware'

export default expres
  .Router()
  .post('/startExam/:userId/:examId', commonMiddle,controller.startExam)
  .post('/markAnswer/:attemptId/:difficultyId/:questionId/:optionId', commonMiddle,controller.markAnswer)
  .post('/submitExam/:userId/:attemptId', commonMiddle,controller.submitExam)
  .get('/examResults/:userId', commonMiddle,controller.examResults)
  .get('/allResult', adminMiddle,controller.allResult)
  .get('/checkExamReport/:attemptId/:userId', commonMiddle,controller.checkExamReport)

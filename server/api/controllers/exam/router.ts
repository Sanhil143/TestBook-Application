import * as express from 'express';
import controller from './controller';
import { adminMiddle, commonMiddle } from '../../middlewares/jwt.middleware';

export default express
  .Router()
  .post('/createExam', adminMiddle, controller.createExam)
  .get('/getAllExams', commonMiddle, controller.getAllExams)
  .get('/getExamById/:examId', commonMiddle, controller.getExamById)
  .get('/randomExamByCategory/:categoryId', commonMiddle, controller.randomExamByCategory)
  .patch('/updateExam/:examId', adminMiddle, controller.updateExam)
  .delete('/deleteExam/:examId', adminMiddle, controller.deleteExam);

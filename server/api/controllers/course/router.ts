import * as express from 'express';
import controller from './controller';
import { adminMiddle, commonMiddle } from '../../middlewares/jwt.middleware';

export default express
  .Router()
  .post('/addCourse', adminMiddle, controller.addCourse)
  .post('/addCourseModule', adminMiddle, controller.addCourseModule)
  .post('/addModuleChapter', adminMiddle, controller.addModuleChapter)
  .get('/allCourse', commonMiddle, controller.allCourse)
  .get('/courseMdules/:courseId', commonMiddle, controller.courseModules)
  .get('/moduleChapter/:moduleId', commonMiddle, controller.moduleChapter)

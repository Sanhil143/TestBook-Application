import * as express from 'express';
import controller from './controller';
import { adminMiddle } from '../../middlewares/jwt.middleware';

export default express
  .Router()
  .post('/candidateRequest', controller.candidateRequest)
  .get('/getAllCandidates', adminMiddle, controller.getAllCandidates)
  .get('/getCandidateDetail/:candidateId', adminMiddle, controller.getCandidateDetail);

import * as express from 'express';
import controller from './controller';
import { adminMiddle } from '../../middlewares/jwt.middleware';

export default express
  .Router()
  .post('/addHidr8Waitlist', adminMiddle, controller.addHidr8Waitlist)
  .get('/allWaitingRequests', adminMiddle, controller.allWaitingRequests)
  .get('/waitingDetails/:uniqueId', controller.waitingDetails);

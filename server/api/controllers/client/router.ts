import * as express from 'express';
import controller from './controller';
import { adminMiddle } from '../../middlewares/jwt.middleware';

export default express
  .Router()
  .post('/clientRequest', controller.clientRequest)
  .get('/getAllClients', adminMiddle, controller.getAllClients)
  .get('/getClientDetail/:clientId', adminMiddle, controller.getClientDetail);

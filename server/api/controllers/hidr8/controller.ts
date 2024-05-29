import { Request, Response } from 'express';
import { addWaitlist } from '../../../validators/hidr8Waitlist';
import Hidr8DbService from '../../services/hidr8.service';

class Controller {
  async addHidr8Waitlist(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body) {
        return res
          .status(400)
          .send({ status: false, error: 'please provide some details' });
      }
      const result = addWaitlist(body);
      if ('error' in result) {
        return res.status(400).send({ status: false, error: result.message });
      }
      const newData = await Hidr8DbService.addHidr8Waitlist(result);
      if (newData === 'your request is updated') {
        return res
          .status(201)
          .send({ status: true, message: 'request is updated' });
      }
      return res
        .status(400)
        .send({ status: false, error: 'error during waitlist updation' });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async allWaitingRequests(req: Request, res: Response) {
    try {
      const page = Number(req.query.page);
      const perPage = Number(req.query.perPage);
      const allLists = await Hidr8DbService.allWaitingRequests(page, perPage);
      const { waitLists, totalPages } = allLists;
      if (waitLists.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res
          .status(200)
          .send({ status: true, totalPages: totalPages, data: allLists });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: 'Internal server error' });
    }
  }

  async waitingDetails(req: Request, res: Response) {
    try {
      const uniqueId = Number(req.params.uniqueId);
      const details = await Hidr8DbService.waitingDetails(uniqueId);
      if (details.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res.status(200).send({ stauts: true, data: details });
      }
    } catch (error) {
      console.error('Error during fetching waiting Details:', error);
      return res
        .status(500)
        .json({ status: false, message: 'Internal server error' });
    }
  }
}

export default new Controller();

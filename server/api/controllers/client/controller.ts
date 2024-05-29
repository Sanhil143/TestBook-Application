import { Request, Response } from 'express';
import ClientService from '../../services/client.service';
import { client } from '../../../validators/client';

class Controller {
  async clientRequest(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body) {
        return res
          .status(400)
          .send({ status: false, error: 'please provide some data' });
      }
      const result = client(body);
      if ('error' in result) {
        return res.status(400).send({ status: false, error: result.message });
      }
      const data = await ClientService.clientRequest(result);
      if (data === 'error during client request') {
        return res
          .status(400)
          .send({
            status: false,
            message: 'Error during client request creation',
          });
      }
      return res
        .status(201)
        .send({ status: true, message: 'client details updated successfully' });
    } catch (error) {
      return res.status(500).send({ status: false, error: error });
    }
  }

  async getAllClients(req: Request, res: Response) {
    try {
      const page = Number(req.query.page);
      const perPage = Number(req.query.perPage);
      const result = await ClientService.getAllClients(page, perPage);
      const { clients, totalPages } = result;
      if (clients.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res
          .status(200)
          .send({ status: true, totalPages, data: clients });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async getClientDetail(req: Request, res: Response) {
    try {
      const clientId = Number(req.params.clientId);
      const result = await ClientService.getClientDetail(clientId);
      if (result.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res.status(200).send({ status: true, data: result });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }
}

export default new Controller();

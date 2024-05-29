import { Request, Response } from 'express';
import CandidateService from '../../services/candidate.service';
import { candidate } from '../../../validators/candidate';

class Controller {
  async candidateRequest(req: Request, res: Response) {
    try {
      const body = req.body;
      const image = (req.files as { [fieldname: string]: any }).resume;
      if (image !== undefined) {
        body.resume = image;
      }
      if (!body) {
        return res
          .status(400)
          .send({ status: false, error: 'all fields are required' });
      }
      const result = await candidate(body);
      if ('error' in result) {
        return res.status(400).send({ status: false, error: result.message });
      }
      const newCandidate = await CandidateService.candidateRequest(result);
      if (newCandidate === 'candidate request created successfully') {
        return res
          .status(201)
          .send({ status: true, message: 'candidate request has been saved' });
      }
      return res
        .status(400)
        .send({ status: false, error: 'error during candidate request' });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async getAllCandidates(req: Request, res: Response) {
    try {
      const page = Number(req.query.page);
      const perPage = Number(req.query.perPage);
      const result = await CandidateService.getAllCandidates(page, perPage);
      const { candidates, totalPages } = result;
      if (candidates.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res
          .status(200)
          .send({ status: true, totalPages, data: candidates });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async getCandidateDetail(req: Request, res: Response) {
    try {
      const candidateId = Number(req.params.candidateId);
      const result = await CandidateService.getCandidateDetail(candidateId);
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

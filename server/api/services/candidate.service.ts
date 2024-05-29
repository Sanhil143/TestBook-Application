import l from '../../common/logger';
import db from './candidate.db.service';
import { candidateData } from '../../interfaces/candidate/createCandidate';

class CandidateService {
  candidateRequest(data: candidateData) {
    l.info(`${this.constructor.name}.candidateRequest()`);
    return db.candidateRequest(data);
  }

  getAllCandidates(page: number, perPage: number) {
    l.info(`${this.constructor.name}.getAllCandidates()`);
    return db.getAllCandidates(page, perPage);
  }

  getCandidateDetail(candidateId: number) {
    l.info(`${this.constructor.name}.getCandidateDetail(${candidateId})`);
    return db.getCandidateDetail(candidateId);
  }
}

export default new CandidateService();

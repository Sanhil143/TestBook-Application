import { Request, Response } from 'express';
import UserService from '../../services/user.service';

class Controller {
  async startExam(req: Request, res: Response) {
    try {
      const examId = Number(req.params.examId);
      const userId = Number(req.params.userId);
      const result = await UserService.startExam(userId, examId);
      if (result === 'error during starting exam') {
        return res
          .status(400)
          .send({ status: false, error: 'error during starting exam' });
      } else {
        return res.status(201).send({ status: true, data: result });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async markAnswer(req: Request, res: Response) {
    try {
      const attemptId = Number(req.params.attemptId);
      const questionId = Number(req.params.questionId);
      const optionId = Number(req.params.optionId);
      const difficultyId = Number(req.params.difficultyId);

      const answer = await UserService.markAnswer(
        attemptId,
        difficultyId,
        questionId,
        optionId
      );
      if (answer === 'Answer already marked for this question') {
        return res.status(400).send({
          status: false,
          message: 'Answer already marked for this question',
        });
      }
      if (answer === 'mark answer succesfully') {
        return res
          .status(201)
          .send({ status: true, message: 'marked answer successfully' });
      } else {
        return res
          .status(400)
          .send({ status: false, error: 'error during mark answer' });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async submitExam(req: Request, res: Response) {
    try {
      const attemptId = Number(req.params.attemptId);
      const userId = Number(req.params.userId);
      const result = await UserService.submitExam(userId, attemptId);
      if (result === 'exam submitted successfully') {
        return res
          .status(201)
          .send({ status: true, message: 'exam submitted successfuly' });
      } else {
        return res
          .status(400)
          .send({ status: false, error: 'error during exam submition' });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async examResults(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const result = await UserService.examResults(userId);
      if (result === 'resource not found') {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res.status(200).send({ status: true, allResults: result });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async allResult(req: Request, res: Response) {
    try {
      const page = Number(req.query.page);
      const perPage = Number(req.query.perPage);
      const result = await UserService.allResult(page, perPage);
      if (result === 'resource not found') {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res
          .status(200)
          .send({
            status: true,
            totalPages: result.totalPages,
            allResults: result.exams,
          });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async checkExamReport(req: Request, res: Response) {
    try {
      const attemptId = Number(req.params.attemptId);
      const userId = Number(req.params.userId);
      const result = await UserService.checkExamReport(attemptId, userId);
      if (result === 'resource not found') {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res
          .status(200)
          .send({
            status: true,
            data:result
          });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }
}

export default new Controller();

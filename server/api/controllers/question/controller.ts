import { Request, Response } from 'express';
import QuestionService from '../../services/question.service';

class Controller {
  async createQuestion(req: Request, res: Response) {
    try {
      const examId = Number(req.params.examId);
      const body = req.body;
      if (!body) {
        return res
          .status(400)
          .send({ status: false, error: 'all fields are required' });
      }
      const questions = await QuestionService.createQuestion(body, examId);
      if (questions === 'question add with options') {
        return res
          .status(201)
          .send({ status: true, message: 'question added with options' });
      } else {
        return res
          .status(400)
          .send({ status: false, error: 'error during creating question' });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async getAllQuestionsbyExamId(req: Request, res: Response) {
    try {
      const examId = Number(req.params.examId);
      if (!examId) {
        return res
          .status(400)
          .send({ status: false, error: 'examId is required' });
      }
      const examQuestions = await QuestionService.getAllQuestionsbyExamId(
        examId
      );
      if (examQuestions === 'resource not found' || examQuestions.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res.status(200).send({ status: true, questions: examQuestions });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }
}

export default new Controller();

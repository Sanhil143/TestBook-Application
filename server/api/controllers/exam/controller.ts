import { Request, Response } from 'express';
import { addExams, modifyExam } from '../../../validators/exams';
import ExamService from '../../services/exam.service';

class Controller {
  async createExam(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body) {
        return res
          .status(400)
          .send({ status: false, error: 'please provide some details' });
      }
      const result = addExams(body);
      if ('error' in result) {
        return res.status(400).send({ status: false, error: result.message });
      }

      const newExam = await ExamService.createExam(result);
      if (!newExam || newExam !== 'exam created successfully') {
        return res
          .status(400)
          .send({ status: false, error: 'error durinf exam creation' });
      } else {
        return res
          .status(201)
          .send({ status: true, message: 'exam created successfully' });
      }
    } catch (error) {
      console.error('Error during createExam:', error);
      return res
        .status(500)
        .json({ status: false, message: 'Internal server error' });
    }
  }

  async getAllExams(req: Request, res: Response) {
    try {
      const page = Number(req.query.page);
      const perPage = Number(req.query.perPage);
      const allExams = await ExamService.allExams(page, perPage);
      const { exams, totalPages } = allExams;
      if (exams.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res
          .status(200)
          .send({ status: true, totalPages: totalPages, data: allExams });
      }
    } catch (error) {
      console.error('Error during getAllExams:', error);
      return res
        .status(500)
        .json({ status: false, message: 'Internal server error' });
    }
  }

  async getExamById(req: Request, res: Response) {
    try {
      const examId = Number(req.params.examId);
      const examDetails = await ExamService.getExamById(examId);
      if (examDetails.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res.status(200).send({ stauts: true, examDetails: examDetails });
      }
    } catch (error) {
      console.error('Error during fetching examDetails:', error);
      return res
        .status(500)
        .json({ status: false, message: 'Internal server error' });
    }
  }

  async updateExam(req: Request, res: Response) {
    try {
      const examId = Number(req.params.examId);
      const body = req.body;
      if (!body) {
        return res
          .status(400)
          .send({ status: false, error: 'please provide data for updation' });
      }
      const result = modifyExam(body);
      if ('error' in result) {
        return res.status(400).send({ status: false, error: result.message });
      }
      const upExam = await ExamService.updateExam(examId, result);
      if (upExam === 'exam updated successfully') {
        return res
          .status(200)
          .send({ status: true, message: 'exam updated successfully' });
      } else {
        return res
          .status(400)
          .send({ status: false, error: 'error during exam updation' });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async deleteExam(req:Request, res:Response){
    try {
      if(!req.params.examId){
        return res.status(400).send({status:false, error:"examId is required"})
      }
      const examId = Number(req.params.examId);
      const result = await ExamService.deleteExam(examId)
      if(result === 'exam deleted successfully'){
        return res.status(200).send({status:true, message:"exam deleted successfully"});
      }
      else{
        return res.status(400).send({status:false, error:"error during exam deletion"})
      }
    } catch (error) {
      return res.status(500).send({status:false, error:error.message})
    }
  }

  async randomExamByCategory(req: Request, res: Response) {
    try {
      const categoryId = Number(req.params.categoryId);
      const examDetails = await ExamService.randomExamByCategory(categoryId);
      if (examDetails.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res.status(200).send({ stauts: true, examDetails: examDetails });
      }
    } catch (error) {
      console.error('Error during fetching examDetails:', error);
      return res
        .status(500)
        .json({ status: false, message: 'Internal server error' });
    }
  }
}

export default new Controller();

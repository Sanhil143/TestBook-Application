import l from '../../common/logger';
import { ExamData } from '../../interfaces/exam/createExam';
import db from '../services/exam.db.service'

class ExamService {
  createExam(data: ExamData) {
    l.info(`${this.constructor.name}.createExam()`);
    return db.createExam(data);
  }

  allExams(page:number,perPage:number) {
    l.info(`${this.constructor.name}.allExams()`);
    return db.allExams(page,perPage);
  }

  getExamById(examId:number) {
    l.info(`${this.constructor.name}.getExamById(${examId})`);
    return db.getExamById(examId);
  }

  updateExam(examId:number, data:ExamData) {
    l.info(`${this.constructor.name}.updateExam(${examId})`);
    return db.updateExam(examId,data);
  }

  deleteExam(examId:number) {
    l.info(`${this.constructor.name}.deleteExam(${examId})`);
    return db.deleteExam(examId);
  }

  randomExamByCategory(categoryId:number) {
    l.info(`${this.constructor.name}.randomExamByCategory(${categoryId})`);
    return db.randomExamByCategory(categoryId);
  }
}

export default new ExamService();

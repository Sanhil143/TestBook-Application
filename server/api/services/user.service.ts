import l from '../../common/logger';
import db from '../services/user.db.service';

class UserService {
  startExam(userId: number, examId: number) {
    l.info(`${this.constructor.name}.startExam(${userId},${examId})`);
    return db.startExam(userId, examId);
  }

  markAnswer(
    attemptId: number,
    difficultyId: number,
    questionId: number,
    optionId: number
  ) {
    l.info(
      `${this.constructor.name}.markAnswer(${attemptId},${difficultyId},${questionId},${optionId})`
    );
    return db.markAnswer(attemptId, difficultyId, questionId, optionId);
  }

  submitExam(userId: number, attemptId: number) {
    l.info(`${this.constructor.name}.submitExam(${userId},${attemptId})`);
    return db.submitExam(userId, attemptId);
  }

  examResults(userId: number) {
    l.info(`${this.constructor.name}.examResults(${userId})`);
    return db.examResults(userId);
  }

  allResult(page: number, perPage: number) {
    l.info(`${this.constructor.name}.allResult()`);
    return db.allResult(page, perPage);
  }

  checkExamReport(attemptId: number, userId: number) {
    l.info(`${this.constructor.name}.checkExamReport(${attemptId},${userId})`);
    return db.checkExamReport(attemptId, userId);
  }
}

export default new UserService();

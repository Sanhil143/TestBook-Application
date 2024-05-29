import l from '../../common/logger';
import db from './question.db.service';
import {QuestionData} from '../../interfaces/question/createQuestion'

class QuestionService{
  createQuestion(data:QuestionData,examId:number){
    l.info(`${this.constructor.name}.createQuestion(${examId})`)
    return db.createQuestion(data,examId)
  }

  getAllQuestionsbyExamId(examId:number){
    l.info(`${this.constructor.name}.createQuestion(${examId})`)
    return db.getAllQuestionsbyExamId(examId)
  }
}

export default new QuestionService()
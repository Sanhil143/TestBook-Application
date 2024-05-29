import sql from 'mssql';
import mssqlConn from '../../common/dbConnection';
import { QuestionData } from '../../interfaces/question/createQuestion';

class QuestionDatabase {
  async createQuestion(data: QuestionData, examId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const transaction = pool.transaction();
      const checkFields = [];
      try {
        await transaction.begin();
        const questionResult = await transaction
          .request()
          .input('examId', sql.Int, examId)
          .input('questionName', sql.NVarChar, data.questionName)
          .input('difficultyId', sql.Int, data.difficultyId)
          .query(
            `insert into tblExamQuestions(examId,question,difficultyId)
             output inserted.questionId
             values(@examId,@questionName,@difficultyId)`
          );
        const questionId = questionResult.recordset[0].questionId;
        if (questionId) {
          for (const option of data.options) {
            await transaction
              .request()
              .input('questionId', sql.Int, questionId)
              .input('optionName', sql.NVarChar, option.optionName)
              .input('isCorrect', sql.Bit, option.isCorrect)
              .query(
                `insert into tblQuestionOptions (questionId, optionName, isCorrect)
                 values (@questionId, @optionName, @isCorrect)`
              );
            checkFields.push('done');
          }
          await transaction.commit();
        }
        if (checkFields.length > 1) {
          return 'question add with options';
        } else {
          return 'error during add options';
        }
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllQuestionsbyExamId(examId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('examId', sql.Int, examId)
        .query(
          ` 
        select 
        tblExams.examId,
        tblExams.examTitle,
        tblExamQuestions.questionId,
        tblExamQuestions.difficultyId,
        tblExamQuestions.question as questionName,
        tblQuestionOptions.optionId,
        tblQuestionOptions.optionName,
        tblQuestionOptions.isCorrect
        from tblExams
        inner join tblExamQuestions on tblExams.examId = tblExamQuestions.examId
        inner join tblQuestionOptions on tblExamQuestions.questionId = tblQuestionOptions.questionId
        where tblExams.examId = @examId and tblExams.isDeleted = 0 and tblExams.isActive = 1
        `
        );
      if (result.recordset) {
        const obj: {
          [key: number]: {
            questionName: string;
            difficultyId: number;
            options: any[];
          };
        } = {};
        result.recordset.forEach((row) => {
          const {
            questionId,
            difficultyId,
            questionName,
            optionId,
            optionName,
            isCorrect,
          } = row;
          if (!obj[questionId]) {
            obj[questionId] = {
              questionName,
              difficultyId,
              options: [],
            };
          }
          obj[questionId].options.push({
            optionId,
            optionName,
            isCorrect,
          });
        });
        const arr = Object.values(obj);
        return arr;
      } else {
        return 'resource not found';
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new QuestionDatabase();

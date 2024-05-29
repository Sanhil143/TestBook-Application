import sql from 'mssql';
import mssqlConn from '../../common/dbConnection';

class UserDatabase {
  async startExam(userId: number, examId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const startTime = new Date().toISOString();
      const result = await pool
        .request()
        .input('userId', sql.Int, userId)
        .input('examId', sql.Int, examId)
        .input('startTime', sql.DateTime, startTime)
        .query(
          `insert into tblExamAttempts(examId,userId,startTime)
      output inserted.attemptId
      values(@examId,@userId,@startTime)`
        );
      const attemptId = result.recordset[0].attemptId;
      if (attemptId) {
        return { message: 'user exam started', attemptId: attemptId };
      } else {
        return 'error during starting exam';
      }
    } catch (error) {
      throw error;
    }
  }

  async markAnswer(
    attemptId: number,
    difficultyId: number,
    questionId: number,
    optionId: number
  ) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const existingAnswer = await pool
        .request()
        .input('attemptId', sql.Int, attemptId)
        .input('questionId', sql.Int, questionId)
        .input('optionId', sql.Int, optionId)
        .query(
          `select 
           * 
           from tblExamAttemptAnswers 
           where attemptId = @attemptId 
           and questionId = @questionId`
        );

      if (existingAnswer.recordset.length > 0) {
        return 'Answer already marked for this question';
      }
      const result = await pool
        .request()
        .input('attemptId', sql.Int, attemptId)
        .input('categoryId', sql.Int, difficultyId)
        .input('questionId', sql.Int, questionId)
        .input('optionId', sql.Int, optionId)
        .query(
          `insert into tblExamAttemptAnswers(
          attemptId,
          questionId,
          difficultyId,
          optionId
        )
        values(
          @attemptId,
          @questionId,
          @difficultyId,
          @optionId
        )`
        );
      if (result.rowsAffected[0] > 0) {
        return 'mark answer succesfully';
      } else {
        return 'error during answer mark';
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async submitExam(userId: number, attemptId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const endTime = new Date().toISOString();
      const attemptIdInput = pool
        .request()
        .input('attemptId', sql.Int, attemptId);
      const result = await attemptIdInput.query(
        `select 
         tblExamAttempts.attemptId,
         count(tblQuestionOptions.optionId) as correct_answer
         from tblExamAttempts
         inner join tblExamAttemptAnswers on tblExamAttempts.attemptId = tblExamAttemptAnswers.attemptId
         inner join tblQuestionOptions on tblExamAttemptAnswers.optionId = tblQuestionOptions.optionId
         where tblExamAttempts.attemptId = @attemptId and tblQuestionOptions.isCorrect = 1
         group by tblExamAttempts.attemptId`
      );
      if (result.recordset.length > 0) {
        const correctAnswer = result.recordset[0].correct_answer;
        const updateScore = await attemptIdInput
          .input('userId', sql.Int, userId)
          .input('score', sql.NVarChar, correctAnswer.toString())
          .input('endTime', sql.DateTime, endTime)
          .query(
            `update tblExamAttempts
             set score = @score, endTime = @endTime
             where userId = @userId and attemptId = @attemptId`
          );
        if (updateScore.rowsAffected && updateScore.rowsAffected[0] > 0) {
          return 'exam submitted successfully';
        } else {
          return 'error during exam submition';
        }
      } else if (result.recordset.length === 0) {
        const updateScore = await attemptIdInput
          .input('userId', sql.Int, userId)
          .input('score', sql.NVarChar, '0')
          .input('endTime', sql.DateTime, endTime)
          .query(
            `update tblExamAttempts
             set score = @score, endTime = @endTime
             where userId = @userId and attemptId = @attemptId`
          );
        if (updateScore.rowsAffected && updateScore.rowsAffected[0] > 0) {
          return 'exam submitted successfully';
        } else {
          return 'error during exam submition';
        }
      } else {
        return 'error during exam submition';
      }
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async examResults(userId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('userId', sql.Int, userId)
        .query(
          `
        select
        examId,
        score,
        startTime,
        endTime,
        createdAt as examDate 
        from tblExamAttempts 
        where userId = @userId 
        and isDelete = 0
        and isActive = 1
        `
        );
      if (result.recordset) {
        return result.recordset;
      } else {
        return 'resource not found';
      }
    } catch (error) {
      throw error;
    }
  }

  async allResult(page: number, perPage: number) {
    try {
      const offsetVal = (page - 1) * perPage;
      const resPerPage = perPage;
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('offsetVal', sql.Int, offsetVal)
        .input('resPerPage', sql.Int, resPerPage)
        .query(
          `select 
          attemptId,
          tblUsers.userId,
          tblExams.examId,
          tblExams.examTitle,
          tblExams.examDuration,
          tblUsers.firstname,
          tblUsers.lastname,
          tblExamAttempts.score,
          tblExamAttempts.startTime,
          tblExamAttempts.endTime
          from tblExamAttempts
          inner join tblUsers on tblExamAttempts.userId = tblUsers.userId
          inner join tblExams on tblExamAttempts.examId = tblExams.examId
          where tblExamAttempts.isDelete = 0
          and tblExamAttempts.isActive = 1
          order by tblExamAttempts.createdAt desc
          offset @offsetVal rows fetch next @resPerPage rows only`
        );
      if (result.recordset.length > 0) {
        const totalPageCount = await pool.request().query(
          `select count(*) as totalCount
          from tblExamAttempts
          where isDelete = 0
          and isActive = 1`
        );
        const totalCount = totalPageCount.recordset[0].totalCount;
        const totalPages = Math.ceil(totalCount / perPage);
        return { exams: result.recordset, totalPages };
      } else {
        return 'resource not found';
      }
    } catch (error) {
      throw error;
    }
  }

  async checkExamReport(attemptId:number, userId:number){
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool.request()
      .input("attemptId", sql.Int, attemptId)
      .input("userId", sql.Int, userId)
      .query(
        `select 
        tblExamAttempts.examId,
        tblExamAttempts.attemptId,
        tblExamAttemptAnswers.optionId,
        tblExamAttemptAnswers.questionId,
        tblExams.examTitle,
        tblExamAttempts.startTime,
        tblExamAttempts.endTime,
        tblExamQuestions.question,
        tblQuestionOptions.optionName,
        tblQuestionOptions.isCorrect
        from tblExamAttempts
        inner join tblExams on tblExamAttempts.examId = tblExams.examId
        inner join tblExamAttemptAnswers on tblExamAttempts.attemptId = tblExamAttemptAnswers.attemptId
        inner join tblExamQuestions on tblExamAttemptAnswers.questionId = tblExamQuestions.questionId
        inner join tblQuestionOptions on tblExamAttemptAnswers.optionId = tblQuestionOptions.optionId
        where tblExamAttempts.attemptId = @attemptId and tblExamAttempts.userId = @userId`
      );
      if(result.recordset.length > 0){
        return result.recordset
      }
      else{
        return 'resource not found'
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new UserDatabase();

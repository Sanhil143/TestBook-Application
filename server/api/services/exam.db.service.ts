import sql from 'mssql';
import mssqlConn from '../../common/dbConnection';
import { ExamData } from '../../interfaces/exam/createExam';

class ExamDatabase {
  async createExam(data: ExamData) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const utcTime = new Date().toISOString();
      const result = await pool
        .request()
        .input('title', sql.NVarChar, data.examTitle)
        .input('categoryId', sql.Int, data.categoryId)
        .input('description', sql.NVarChar, data.examDescription)
        .input('duration', sql.NVarChar, data.examDuration)
        .input('utcTime', sql.DateTime, utcTime)
        .query(
          `insert into tblExams(
          examTitle,
          categoryId,
          examDescription,
          examDuration,
          createdAt
        )
        values(
          @title,
          @categoryId,
          @description,
          @duration,
          @utcTime
        )`
        );
      if (result.rowsAffected && result.rowsAffected[0] > 0) {
        return 'exam created successfully';
      } else {
        throw new Error('error during exam creation');
      }
    } catch (error) {
      throw error;
    }
  }

  async allExams(page: number, perPage: number) {
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
         examId,
         examTitle,
         examDuration,
         createdAt
         from tblExams
         where isDeleted = 0 and isActive = 1
         order by createdAt desc
         OFFSET @offsetVal ROWS FETCH NEXT @resPerPage ROWS ONLY`
        );
      if (result.recordset.length > 0) {
        const totalPageCount = await pool.request().query(
          `select 
          count(*) as totalCount
          from tblExams
          where isDeleted = 0 and isActive = 1`
        );
        const totalCount = totalPageCount.recordset[0].totalCount;
        const totalPages = Math.ceil(totalCount / perPage);
        return { exams: result.recordset, totalPages };
      } else {
        throw new Error('error during fetch all exams');
      }
    } catch (error) {
      throw error;
    }
  }

  async getExamById(examId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('examId', sql.Int, examId)
        .query(
        `select 
        * 
        from tblExams 
        where examId = @examId 
        and isDeleted = 0 and isActive = 1`
        );
      if (result.recordset) {
        return result.recordset;
      } else {
        throw new Error('error during fetching exam details');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateExam(examId: number, data: ExamData) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = pool.request();
      const examIdInput = result.input('examId', sql.Int, examId);
      const updatedFields = [];
      if (data.examTitle) {
        const titleInput = examIdInput.input(
          'examTitle',
          sql.NVarChar,
          data.examTitle
        );
        const titleQuery = await titleInput.query(
          `update tblExams set examTitle = @examTitle where examId = @examId and isDeleted = 0`
        );
        if (titleQuery.rowsAffected[0] > 0) {
          updatedFields.push('examTitle');
        }
      }
      if (data.examDuration) {
        const durationInput = examIdInput.input(
          'examDuration',
          sql.NVarChar,
          data.examDuration
        );
        const durationQuery = await durationInput.query(
          `update tblExams set examDuration = @examDuration where examId = @examId and isDeleted = 0`
        );
        if (durationQuery.rowsAffected[0] > 0) {
          updatedFields.push('examDuration');
        }
      }
      if (data.examDescription) {
        const descriptionInput = examIdInput.input(
          'examDescription',
          sql.NVarChar,
          data.examDescription
        );
        const descriptionQuery = await descriptionInput.query(
          `update tblExams set examDescription = @examDescription where examId = @examId and isDeleted = 0`
        );
        if (descriptionQuery.rowsAffected[0] > 0) {
          updatedFields.push('examDescription');
        }
      }
      if (updatedFields.length > 0) {
        return 'exam updated successfully';
      } else {
        return 'no fields updated';
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteExam(examId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('examId', sql.Int, examId)
        .query(
          `update tblExams set isDeleted = 1, isActive = 0 where examId = @examId and isDeleted = 0`
        );
        if(result.rowsAffected[0] > 0){
          return 'exam deleted successfully';
        }else{
          return 'error during exam deletion'
        }
    } catch (error) {
      throw error;
    }
  }

  async randomExamByCategory(categoryId:number){
    try {
      const pool =  await mssqlConn.getDbConnection();
      const result = await pool.request()
      .input("categoryId" , sql.Int, categoryId)
      .query(
        `select top 4 * 
         from tblExams 
         where isActive = 1
         and isDeleted = 0
         and categoryId = @categoryId
         order by newid()`
      );
      if(result.recordset.length > 0){
        return result.recordset;
      }else{
        return 'resource not found'
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new ExamDatabase();

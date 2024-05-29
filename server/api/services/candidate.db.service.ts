import sql from 'mssql';
import mssqlConn from '../../common/dbConnection';
import { candidateData } from '../../interfaces/candidate/createCandidate';

class CandidateDatabase {
  async candidateRequest(data: candidateData) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('firstname', sql.NVarChar, data.firstName)
        .input('lastName', sql.NVarChar, data.lastName)
        .input('email', sql.NVarChar, data.email)
        .input('mobile', sql.NVarChar, data.mobile)
        .input('location', sql.NVarChar, data.location)
        .input('resume', sql.NVarChar, data.resume)
        .query(
          `insert into tblCandidate(
          firstname,
          lastname,
          email,
          mobile,
          resident,
          resumeUrl
        )
        values(
          @firstname,
          @lastname,
          @email,
          @mobile,
          @location,
          @resume
        )`
        );
      if (result.rowsAffected && result.rowsAffected[0] > 0) {
        return 'candidate request created successfully';
      } else {
        return 'error during candidate request';
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllCandidates(page: number, perPage: number) {
    try {
      const offsetVal = (page - 1) * perPage;
      const resPerPage = perPage;
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('offsetVal', sql.Int, offsetVal)
        .input('resPerPage', sql.Int, resPerPage)
        .query(`select * from tblCandidate order by createdAt desc`);
      if (result.recordset.length > 0) {
        const totalPageCount = await pool.request().query(
          `select 
            count(*) as totalCount
            from tblCandidate`
        );
        const totalCount = totalPageCount.recordset[0].totalCount;
        const totalPages = Math.ceil(totalCount / perPage);
        return { candidates: result.recordset, totalPages };
      } else {
        throw new Error('error during fetch all candidates');
      }
    } catch (error) {
      throw error;
    }
  }

  async getCandidateDetail(candidateId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('candidateId', sql.Int, candidateId)
        .query(
          `select * from tblCandidate
           where candidateId = @candidateId`
        );
      if (result.recordset.length > 0) {
        return result.recordset;
      } else {
        throw new Error('error during fetch candidates');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new CandidateDatabase();

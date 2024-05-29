import sql from 'mssql';
import mssqlConn from '../../common/dbConnection';
import {hidr8Data} from '../../interfaces/hidr8/createWaitlist'

class Hidr8Database{
  async addHidr8Waitlist(data:hidr8Data){
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool.request()
      .input("name", sql.NVarChar, data.name)
      .input("email", sql.NVarChar, data.email)
      .input("mobile", sql.NVarChar, data.mobile)
      .input("location", sql.NVarChar, data.location)
      .input("message", sql.NVarChar, data.message)
      .query(
        `insert into tblHidr8Waitlist(
          name,
          email,
          mobile,
          resident,
          message
        )
        values(
          @name,
          @email,
          @mobile,
          @location,
          @message
        )`
      );
      if(result.rowsAffected && result.rowsAffected[0] > 0){
        return 'your request is updated'
      }else{
        return 'error during waitlist updation'
      }
    } catch (error) {
      throw error;
    }
  }

  async allWaitingRequests(page: number, perPage: number) {
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
         *
         from tblHidr8Waitlist
         order by createdAt desc
         OFFSET @offsetVal ROWS FETCH NEXT @resPerPage ROWS ONLY`
        );
      if (result.recordset.length > 0) {
        const totalPageCount = await pool.request().query(
          `select 
          count(*) as totalCount
          from tblHidr8Waitlist`
        );
        const totalCount = totalPageCount.recordset[0].totalCount;
        const totalPages = Math.ceil(totalCount / perPage);
        return { waitLists: result.recordset, totalPages };
      } else {
        throw new Error('error during fetch all waitLists');
      }
    } catch (error) {
      throw error;
    }
  }

  async waitingDetails(uniqueId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('uniqueId', sql.Int, uniqueId)
        .query(
        `select 
        * 
        from tblHidr8Waitlist 
        where uniqueId = @uniqueId`
        );
      if (result.recordset) {
        return result.recordset;
      } else {
        throw new Error('error during fetching waitings details');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new Hidr8Database();
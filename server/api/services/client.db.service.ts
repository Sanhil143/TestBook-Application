import sql from 'mssql';
import mssqlConn from '../../common/dbConnection';
import { ClientData } from '../../interfaces/client/createClient';

class ClientDatabase {
  async clientRequest(data: ClientData) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('firstName', sql.NVarChar, data.firstName)
        .input('lastName', sql.NVarChar, data.lastName)
        .input('email', sql.NVarChar, data.email)
        .input('mobile', sql.NVarChar, data.mobile)
        .input('message', sql.NVarChar, data.message)
        .query(
          `insert into tblClient(
          firstname,
          lastname,
          email,
          mobile,
          message
        )
        values(
          @firstname,
          @lastname,
          @email,
          @mobile,
          @message
        )`
        );
      if (result.rowsAffected && result.rowsAffected[0] > 0) {
        return 'client request saved successfully';
      } else {
        return 'error during client request';
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllClients(page: number, perPage: number) {
    try {
      const offsetVal = (page - 1) * perPage;
      const resPerPage = perPage;
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('offsetVal', sql.Int, offsetVal)
        .input('resPerPage', sql.Int, resPerPage)
        .query(`select * from tblClient order by createdAt desc`);
      if (result.recordset.length > 0) {
        const totalPageCount = await pool.request().query(
          `select 
            count(*) as totalCount
            from tblClient`
        );
        const totalCount = totalPageCount.recordset[0].totalCount;
        const totalPages = Math.ceil(totalCount / perPage);
        return { clients: result.recordset, totalPages };
      } else {
        throw new Error('error during fetch all clients');
      }
    } catch (error) {
      throw error;
    }
  }

  async getClientDetail(clientId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('clientId', sql.Int, clientId)
        .query(
          `select * from tblClient
           where clientId = @clientId`
        );
      if (result.recordset.length > 0) {
        return result.recordset;
      } else {
        throw new Error('error during fetch clients');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new ClientDatabase();

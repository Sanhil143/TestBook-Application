import sql from 'mssql';
import mssqlConn from '../../common/dbConnection';
import { UserData } from '../../interfaces/auth/Signup';
import { UserLogin } from '../../interfaces/auth/Signin';

class AuthDatabase {
  async userSignup(data: UserData) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const currentUTCDate = new Date().toISOString();
      const result = await pool
        .request()
        .input('firstName', sql.NVarChar, data.firstName)
        .input('lastName', sql.NVarChar, data.lastName)
        .input('email', sql.NVarChar, data.email)
        .input('password', sql.NVarChar, data.password)
        .input('role', sql.NVarChar, data.role)
        .input('currentUTCDate', sql.DateTime, currentUTCDate)
        .query(
          `IF NOT EXISTS (SELECT 1 FROM tblUsers WHERE email = @email)
            BEGIN
              INSERT INTO tblUsers (
                firstname,
                lastname,
                email,
                password,
                role,
                createdAt
              )
              VALUES (
                @firstName,
                @lastName,
                @email,
                @password,
                @role,
                @currentUTCDate
              )
            END`
        );

      if (result.rowsAffected && result.rowsAffected[0] > 0) {
        return 'User created Successfully';
      } else {
        throw new Error('Error during user creation');
      }
    } catch (err) {
      throw err;
    }
  }

  async userLogin(data: UserLogin) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('email', sql.NVarChar, data.email)
        .input('password', sql.NVarChar, data.password)
        .query(
          `if exists (select 1 from tblUsers where email = @email)
          begin
          select 
          * 
          from tblUsers 
          where tblUsers.email = @email 
          and tblUsers.isDeleted = 0
          end`
        );

      if (result.recordset.length > 0) {
        return result.recordset;
      } else {
        throw new Error('email is invalid');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthDatabase();

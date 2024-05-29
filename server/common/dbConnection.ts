import mssql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

class DBConnection {
  getDbConnection() {
    try {
      return mssql.connect(config);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new DBConnection();

import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sql from 'mssql';
import mssqlConn from '../../common/dbConnection';
import bcrypt from 'bcrypt';

interface DecodedToken extends JwtPayload {
  userId?: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: number;
  }
}

export const isValid = async (email: string, pass: string) => {
  try {
    if (!email) {
      return 'email is required';
    }
    if (!pass) {
      return 'password is required';
    }
    const pool = await mssqlConn.getDbConnection();
    const result = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query(`select * from tblUsers where email = @email`);
    if (result.recordset.length < 1) {
      return 'Email does not exist';
    }
    const hashedPass = await bcrypt.compare(pass, result.recordset[0].password);
    if (!hashedPass) {
      return 'required correct password';
    }
    if (result.recordset[0] && hashedPass) {
      return result.recordset[0];
    } else {
      return false;
    }
  } catch (error) {
    return error.message;
  }
};

export const adminMiddle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Basic ')) {
      const credentials = Buffer.from(authHeader.split(' ')[1], 'base64')
        .toString('utf-8')
        .split(':');
      const username = credentials[0];
      const password = credentials[1];
      const validUser = await isValid(username, password);
      if (validUser.role === 'admin') {
        return next();
      } else {
        return res.status(403).send({ status: false, error: 'Unauthorized' });
      }
    } else if (authHeader && authHeader.startsWith('bearer ')) {
      const token = authHeader.split(' ')[1];
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as DecodedToken;
      if (decodedToken.role === 'admin') {
        req.user = decodedToken.userId;
        return next();
      } else {
        return res.status(403).json({
          status: false,
          error: 'Unauthorized',
        });
      }
    } else {
      return res.status(401).send({ status: false, error: 'Unauthenticated' });
    }
  } catch (error) {
    return res.status(401).json({ status: false, error: error.message });
  }
};

export const commonMiddle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Basic ')) {
      const credentials = Buffer.from(authHeader.split(' ')[1], 'base64')
        .toString('utf-8')
        .split(':');
      const username = credentials[0];
      const password = credentials[1];
      const validUser = await isValid(username, password);
      if (validUser.role === 'admin' || validUser.role === 'user') {
        return next();
      } else {
        return res.status(403).send({ status: false, error: 'Unauthorized' });
      }
    } else if (authHeader && authHeader.startsWith('bearer ')) {
      const token = authHeader.split(' ')[1];
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as DecodedToken;
      if (decodedToken.role === 'admin' || decodedToken.role === 'user') {
        req.user = decodedToken.userId;
        return next();
      } else {
        return res.status(403).json({
          status: false,
          error: 'Unauthorized',
        });
      }
    } else {
      return res.status(401).send({ status: false, error: 'Unauthenticated' });
    }
  } catch (error) {
    return res.status(401).json({ status: false, error: error.message });
  }
};

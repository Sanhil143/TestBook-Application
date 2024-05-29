import { Request, Response } from 'express';
import AuthService from '../../services/auth.service';
import {Login,Signup,generateToken,passwordChecker} from '../../../validators/userAuth';

class Controller {
  async userSignup(req: Request, res: Response) {
    try {
      const body = req.body;

      if (!body) {
        return res
          .status(400)
          .json({ status: false, message: 'Please provide some data' });
      }
      const result = await Signup(body);
      if ('error' in result) {
        return res.status(400).json({ status: false, error: result.error });
      }
      const userSignupResult = await AuthService.userSignup(result);
      if (!userSignupResult) {
        return res.status(400).json({
          status: false,
          message: 'Bad request during signup or email already exists',
        });
      } else {
        return res
          .status(201)
          .json({ status: true, message: 'User signed up successfully' });
      }
    } catch (error) {
      console.error('Error during userSignup:', error);
      return res
        .status(500)
        .json({ status: false, message: 'Internal server error' });
    }
  }

  async userLogin(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body) {
        return res.status(400).send({
          status: false,
          error: 'please prove some credentials for login',
        });
      }
      const result = Login(body);
      if ('error' in result) {
        return res.status(400).send({ status: false, error: result.message });
      }
      const userLogin = await AuthService.userLogin(result);
      if (!userLogin || userLogin.length === 0) {
        return res.status(400).send({
          status: false,
          error: 'email is not exist please check your email',
        });
      }
      const hashed = await passwordChecker(
        body.password,
        userLogin[0].password
      );
      if (hashed !== true) {
        return res.status(400).send({
          status: false,
          error: 'please enter correct password or reset your password',
        });
      }
      const token = generateToken(userLogin[0].userId,userLogin[0].role);
      delete userLogin[0].password;
      return res.status(200).send({
        status: true,
        message: 'account login successfully',
        token: token,
        data: userLogin,
      });
    } catch (error) {
      return res.status(500).send({ status: false, error: error });
    }
  }
}

export default new Controller();

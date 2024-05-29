import l from '../../common/logger';
import { UserData } from '../../interfaces/auth/Signup';
import { UserLogin } from '../../interfaces/auth/Signin';
import db from '../services/auth.db.service';

class AuthService {
  userSignup(data: UserData) {
    l.info(`${this.constructor.name}.userSignup()`);
    return db.userSignup(data);
  }
  userLogin(data: UserLogin) {
    l.info(`${this.constructor.name}.userLogin()`);
    return db.userLogin(data);
  }
}

export default new AuthService();

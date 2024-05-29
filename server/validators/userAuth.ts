import {CustomErrorResponse} from '../interfaces/commonInterface';
import {UserData} from '../interfaces/auth/Signup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const generateToken = (userId:number,role:string):string => {
  return jwt.sign({userId,role},process.env.JWT_SECRET as string,
    { expiresIn: '1d' })
}

const passwordChecker = async(userPass:string,hashedPass:any):Promise <boolean | string> => {
  try {
    const hash = await bcrypt.compare(userPass,hashedPass);
    return hash ? true : false;
  } catch (error) {
    return error.message;
  }
}

const Signup = async (data: UserData): Promise <UserData | CustomErrorResponse> => {
  try {
    const { firstName, lastName, email, password,role } = data;
    if (!firstName) {
      throw new Error('first name is required');
    }
    data.firstName = firstName.trim().toLowerCase();
    if (!lastName) {
      throw new Error('last name is required');
    }
    data.lastName = lastName.trim().toLowerCase();
    if (!email) {
      throw new Error('email is required');
    }
    data.email = email.trim()
    if (!password || password.length < 6) {
      throw new Error('password is required or password length is minimum 6');
    }
    data.password = await bcrypt.hash(password, 10);
    if(!role){
      throw new Error('role is required');
    }
    data.role = role.trim().toLowerCase();
    return data;
  } catch (error) {
    return { error: true, message: error.message }
  }
};

const Login = (data:UserData):UserData | CustomErrorResponse => {
  try {
    const { email,password} = data;
    if (!email) {
      throw new Error('email is required');
    }
    data.email = email.trim();
    if (!password || password.length < 6) {
      throw new Error('password is required or password length is minimum 6');
    }
    return data;
  } catch (error) {
    return { error: true, message: error.message }
  }
};

export { generateToken,passwordChecker,Signup,Login };

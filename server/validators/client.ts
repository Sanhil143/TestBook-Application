import {CustomErrorResponse,} from '../interfaces/commonInterface';
import {ClientData} from '../interfaces/client/createClient'

export const client = (data: ClientData):ClientData | CustomErrorResponse => {
  try {
    const { firstName, lastName, email, mobile, message } = data;
    if (!firstName) {
      throw new Error('first name is required');
    }
    data.firstName = firstName.trim().toLowerCase();
    if (!lastName) {
      throw new Error('last name is required');
    }
    data.lastName = lastName.trim().toLowerCase();
    if (!mobile) {
      throw new Error('mobile is required');
    }
    data.mobile = mobile.toString().trim();
    if (!email) {
      throw new Error('email is required');
    }
    data.email = email.trim()
    if (message) {
      data.message = message.trim();
    }
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

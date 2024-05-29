import { hidr8Data } from '../interfaces/hidr8/createWaitlist';
import { CustomErrorResponse } from '../interfaces/commonInterface';

export const addWaitlist = (
  data: hidr8Data
): hidr8Data | CustomErrorResponse => {
  try {
    const { email, location, message, mobile, name } = data;
    if (!name) {
      throw new Error('name is required');
    }
    if (!email) {
      throw new Error('email is required');
    }
    if (!location) {
      throw new Error('location is required');
    }
    if (!mobile) {
      throw new Error('exam duration is required');
    }

    if (message) {
      data.message = message.trim();
    }
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

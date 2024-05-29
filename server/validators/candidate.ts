import {compressImages} from '../common/imageReducer'
import {candidateData} from '../interfaces/candidate/createCandidate'
import {CustomErrorResponse} from '../interfaces/commonInterface'

export const candidate = async(data:candidateData): Promise<candidateData | CustomErrorResponse> => {
  try {
    const { firstName, lastName, email, mobile,location,resume } = data;
    if (!firstName) {
      throw new Error('first name is required');
    }
    data.firstName = firstName.trim().toLowerCase();
    if (!lastName) {
      throw new Error('last name is required');
    }
    data.lastName = lastName.trim().toLowerCase();
    if (!location) {
      throw new Error('location name is required');
    }
    data.location = location.trim().toLowerCase();
    if (!mobile) {
      throw new Error('mobile is required');
    }
    data.mobile = mobile.toString().trim();
    if (!email) {
      throw new Error('email is required');
    }
    data.email = email.trim()
    if (resume) {
      const folderPath = './public/images/resumes';
      const resumeUrl = await compressImages(resume,folderPath,'resumes');
      data.resume = resumeUrl;
    }
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
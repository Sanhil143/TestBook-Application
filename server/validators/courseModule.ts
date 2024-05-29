import { CustomErrorResponse } from "../interfaces/commonInterface";
import { courseModuleData } from "../interfaces/course/createCourseModule";


export const createModule = (data:courseModuleData):courseModuleData | CustomErrorResponse => {
  try {
    const { courseId,moduleTitle,moduleDescription } = data;
    if (!courseId) {
      throw new Error('courseId is required');
    }
    if (!moduleTitle) {
      throw new Error('moduleTitle is required');
    }
    if (!moduleDescription) {
      throw new Error('moduleDescription is required');
    }
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
import {courseData } from '../interfaces/course/createCourse';
import { CustomErrorResponse } from '../interfaces/commonInterface';

export const createCourse = (data: courseData): courseData | CustomErrorResponse => {
  try {
    const { categoryId,courseTitle,courseDescription,previewLink,authorName,authorDescription } = data;
    if (!categoryId) {
      throw new Error('categoryId is required');
    }
    if (!courseTitle) {
      throw new Error('courseTitle is required');
    }
    if (!courseDescription) {
      throw new Error('courseDescription is required');
    }
    if (!previewLink) {
      throw new Error('previewLink is required');
    }
    if (!authorName) {
      throw new Error('authorName is required');
    }
    if (!authorDescription) {
      throw new Error('authorDescription is required');
    }
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};


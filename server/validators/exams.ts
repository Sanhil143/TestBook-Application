import { ExamData } from '../interfaces/exam/createExam';
import { CustomErrorResponse } from '../interfaces/commonInterface';

export const addExams = (data: ExamData): ExamData | CustomErrorResponse => {
  try {
    const { examTitle, categoryId, examDescription, examDuration } = data;
    if (!examTitle) {
      throw new Error('exam title is required');
    }
    if (!categoryId) {
      throw new Error('categoryId is required');
    }
    if (!examDescription) {
      throw new Error('exam description is required');
    }
    if (!examDuration) {
      throw new Error('exam duration is required');
    }
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const modifyExam = (data: ExamData): ExamData | CustomErrorResponse => {
  try {
    if (!data) {
      throw new Error('please provide some data for updation');
    }
    const { examTitle, examDescription, examDuration } = data;
    if (!examTitle && !examDescription && !examDuration) {
      throw new Error('please provide data for updation');
    }
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

import {chapterData} from '../interfaces/course/createModuleChapter'
import {CustomErrorResponse} from '../interfaces/commonInterface'


export const createChapter = (data:chapterData):chapterData|CustomErrorResponse => {
  try {
    const { moduleId,chapterTitle,chapterDescription,chapterUrl } = data;
    if (!moduleId) {
      throw new Error('moduleId is required');
    }
    if (!chapterTitle) {
      throw new Error('chapterTitle is required');
    }
    if (!chapterDescription) {
      throw new Error('chapterDescription is required');
    }
    if (!chapterUrl) {
      throw new Error('chapterUrl is required');
    }
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
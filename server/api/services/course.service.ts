import l from '../../common/logger';
import { courseModuleData } from '../../interfaces/course/createCourseModule';
import { courseData } from '../../interfaces/course/createCourse';
import { chapterData } from '../../interfaces/course/createModuleChapter';
import db from './course.db.service';

class CourseService {
  addCourse(data: courseData) {
    l.info(`${this.constructor.name}.addCourse()`);
    return db.addCourse(data);
  }

  addCourseModule(data: courseModuleData) {
    l.info(`${this.constructor.name}.addCourseModule()`);
    return db.addCourseModule(data);
  }

  addModuleChapter(data: chapterData) {
    l.info(`${this.constructor.name}.addModuleChapter()`);
    return db.addModuleChapter(data);
  }

  allCourse(page: number, perPage: number,categoryId:number) {
    l.info(`${this.constructor.name}.allCourse(${categoryId})`);
    return db.allCourse(page, perPage,categoryId);
  }

  courseModules(courseId: number) {
    l.info(`${this.constructor.name}.courseModules(${courseId})`);
    return db.courseModules(courseId);
  }

  moduleChapter(moduleId: number) {
    l.info(`${this.constructor.name}.moduleChapter(${moduleId})`);
    return db.moduleChapter(moduleId);
  }
}
export default new CourseService();

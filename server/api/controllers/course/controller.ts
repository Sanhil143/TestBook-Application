import { Request, Response } from 'express';
import CourseService from '../../services/course.service';
import { createCourse } from '../../../validators/course';
import { createModule } from '../../../validators/courseModule';
import { createChapter } from '../../../validators/courseModuleChapter';

class Controller {
  async addCourse(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body) {
        return res
          .status(400)
          .send({ status: false, error: 'all fields are required' });
      }
      const result = createCourse(body);
      if ('error' in result) {
        return res.status(400).send({ status: false, error: result.message });
      }
      const newCourse = await CourseService.addCourse(result);
      if (newCourse === 'course created successfully') {
        return res
          .status(201)
          .send({ status: true, message: 'course created sucessfully' });
      }
      return res
        .status(400)
        .send({ status: false, error: 'error during course creation' });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async addCourseModule(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body) {
        return res
          .status(400)
          .send({ status: false, error: 'all fields are required' });
      }
      const result = createModule(body);
      if ('error' in result) {
        return res.status(400).send({ status: false, error: result.message });
      }

      const newModule = await CourseService.addCourseModule(result);
      if (newModule === 'modules add successfully on course') {
        return res
          .status(201)
          .send({ status: true, message: 'module add successfully on course' });
      }
      return res
        .status(400)
        .send({ stauts: false, error: 'error during module creation' });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async addModuleChapter(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body) {
        return res
          .status(400)
          .send({ status: false, error: 'all fields are required' });
      }
      const result = createChapter(body);
      if ('error' in result) {
        return res.status(400).send({ status: false, error: result.message });
      }
      const newChapter = await CourseService.addModuleChapter(result);
      if (newChapter === 'chapter add successfully') {
        return res
          .status(201)
          .send({ status: true, message: 'chapter add successfully' });
      }
      return res
        .status(400)
        .send({ status: false, error: 'error during chapter creation' });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async allCourse(req: Request, res: Response) {
    try {
      const page = Number(req.query.page);
      const perPage = Number(req.query.perPage);
      const categoryId = Number(req.query.categoryId)
      const result = await CourseService.allCourse(page, perPage,categoryId);
      const { course, totalPages } = result;
      if (course.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res
          .status(200)
          .send({ status: true, totalPages: totalPages, data: result });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async courseModules(req: Request, res: Response) {
    try {
      const courseId = Number(req.params.courseId);
      const result = await CourseService.courseModules(courseId);
      if (result === 'resource not found' || result.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res.status(200).send({ status: true, data: result });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }

  async moduleChapter(req: Request, res: Response) {
    try {
      const moduleId = Number(req.params.moduleId);
      const result = await CourseService.moduleChapter(moduleId);
      if (result === 'resource not found' || result.length === 0) {
        return res
          .status(404)
          .send({ status: false, error: 'resource not found' });
      } else {
        return res.status(200).send({ status: true, data: result });
      }
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }
}

export default new Controller();

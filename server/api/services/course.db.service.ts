import sql from 'mssql';
import mssqlConn from '../../common/dbConnection';
import { courseData } from '../../interfaces/course/createCourse';
import { courseModuleData } from '../../interfaces/course/createCourseModule';
import { chapterData } from '../../interfaces/course/createModuleChapter';

class CourseDatabase {
  async addCourse(data: courseData) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('categoryId', sql.Int, data.categoryId)
        .input('courseTitle', sql.NVarChar, data.courseTitle)
        .input('courseDescription', sql.NVarChar, data.courseDescription)
        .input('previewLink', sql.NVarChar, data.previewLink)
        .input('authorName', sql.NVarChar, data.authorName)
        .input('authorDescription', sql.NVarChar, data.authorDescription)
        .query(
          `insert into tblCourses(
          categoryId,
          courseTitle,
          courseDescription,
          previewLink,
          authorName,
          authorDescription
        )
        values(
          @categoryId,
          @courseTitle,
          @courseDescription,
          @previewLink,
          @authorName,
          @authorDescription
        )`
        );
      if (result.rowsAffected && result.rowsAffected[0] > 0) {
        return 'course created successfully';
      } else {
        return 'error during course creation';
      }
    } catch (error) {
      throw error;
    }
  }

  async addCourseModule(data: courseModuleData) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('courseId', sql.Int, data.courseId)
        .input('moduleTitle', sql.NVarChar, data.moduleTitle)
        .input('moduleDescription', sql.NVarChar, data.moduleDescription)
        .query(
          `insert into tblCourseModules(
          courseId,
          moduleTitle,
          moduleDescription
        )
        values(
          @courseId,
          @moduleTitle,
          @moduleDescription
        )`
        );
      if (result.rowsAffected && result.rowsAffected[0] > 0) {
        return 'modules add successfully on course';
      } else {
        return 'error during module creation';
      }
    } catch (error) {
      throw error;
    }
  }

  async addModuleChapter(data: chapterData) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('moduleId', sql.Int, data.moduleId)
        .input('chapterTitle', sql.NVarChar, data.chapterTitle)
        .input('chapterDescription', sql.NVarChar, data.chapterDescription)
        .input('chapterUrl', sql.NVarChar, data.chapterUrl)
        .query(
          `insert into tblCourseModuleChapters(
          moduleId,
          chapterTitle,
          chapterDescription,
          chapterUrl
        )
        values(
          @moduleId,
          @chapterTitle,
          @chapterDescription,
          @chapterUrl
        )`
        );
      if (result.rowsAffected && result.rowsAffected[0] > 0) {
        return 'chapter add successfully';
      } else {
        return 'error during chapter creation';
      }
    } catch (error) {
      throw error;
    }
  }

  async allCourse(page: number, perPage: number, categoryId: number) {
    try {
      const offsetVal = (page - 1) * perPage;
      const resPerPage = perPage;
      const pool = await mssqlConn.getDbConnection();
      let query = 
      `select
       tblCourses.courseId,
       tblCategory.categoryId,
       tblCategory.categoryName,
       courseTitle,
       courseDescription,
       previewLink,
       authorName,
       authorDescription
       from tblCourses
       inner join tblCategory on tblCourses.categoryId = tblCategory.categoryId
       where isDeleted = 0 and tblCourses.isActive = 1`;

       if(categoryId){
        query += ` and tblCategory.categoryId = @categoryId`
       }

       query += 
       ` order by createdAt desc
       OFFSET @offsetVal ROWS FETCH NEXT @resPerPage ROWS ONLY`

      const result = await pool
        .request()
        .input('offsetVal', sql.Int, offsetVal)
        .input('resPerPage', sql.Int, resPerPage)
        .input('categoryId', sql.Int, categoryId)
        .query(query);
      if (result.recordset.length > 0) {
        const totalPageCount = await pool.request().query(
          `select 
          count(*) as totalCount
          from tblCourses
          where isDeleted = 0 and isActive = 1`
        );
        const totalCount = totalPageCount.recordset[0].totalCount;
        const totalPages = Math.ceil(totalCount / perPage);
        return { course: result.recordset, totalPages };
      } else {
        throw new Error('resource not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async courseModules(courseId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('courseId', sql.Int, courseId)
        .query(
          `select 
           tblCourses.courseId,
           moduleId,
           moduleTitle,
           moduleDescription
           from tblCourses
           inner join tblCourseModules on tblCourses.courseId = tblCourseModules.courseId
           where tblCourses.courseId = @courseId
           and tblCourses.isDeleted = 0 
           and tblCourses.isActive = 1 
           and tblCourseModules.isDeleted = 0 
           and tblCourseModules.isActive = 1 `
        );
      if (result.recordset.length > 0) {
        return result.recordset;
      } else {
        return 'resource not found';
      }
    } catch (error) {
      throw error;
    }
  }

  async moduleChapter(moduleId: number) {
    try {
      const pool = await mssqlConn.getDbConnection();
      const result = await pool
        .request()
        .input('moduleId', sql.Int, moduleId)
        .query(
          `select 
         tblCourseModules.courseId,
         tblCourseModules.moduleId,
         tblCourseModuleChapters.chapterId,
         tblCourseModules.moduleTitle,
         tblCourseModuleChapters.chapterTitle,
         tblCourseModuleChapters.chapterDescription,
         tblCourseModuleChapters.chapterUrl
         from tblCourseModules
         inner join tblCourseModuleChapters on tblCourseModules.moduleId = tblCourseModuleChapters.moduleId
         where tblCourseModules.moduleId = @moduleId
         and tblCourseModules.isDeleted = 0 
         and tblCourseModules.isActive = 1 
         and tblCourseModuleChapters.isDeleted = 0 
         and tblCourseModuleChapters.isActive = 1`
        );
      if (result.recordset.length > 0) {
        return result.recordset;
      } else {
        return 'resource not found';
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new CourseDatabase();

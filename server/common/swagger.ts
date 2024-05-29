import middleware from 'swagger-express-middleware';
import { Application } from 'express';
import path from 'path';

export default function swagger(app:Application,routes:any){
  return new Promise<void>((resolve,reject) => {
    middleware(path.join(__dirname,'api.v1.yml'),app,(err:any,mw:any) => {
      if(err){
        return reject(err);
      }
      app.enable('case sensitive routing');
      app.enable('strict routing');
      app.use(mw.metadata());
      app.use(
        mw.files({
          caseSensitive: false,
          strict: false,
        },{
          useBasePath: false,
          apiPath: process.env.SWAGGER_API_SPEC,
        })
      );
      app.use(
        mw.parseRequest({
          cookie:{
            secret: process.env.SESSION_SECRET,
          },
          json:{
            limit: process.env.REQUEST_LIMIT,
          }
        })
      );
      routes(app);
      return resolve();
    });
  });
}  
import express, {Application} from 'express'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import os from 'os';
import http from 'http';
import path from 'path'
import l from './logger';
import oas from './swagger';

const app:Application = express();

export default class ExpressServer{
  private routes:any;
  
  constructor(){
    const root = path.normalize(`${__dirname}/../..`)
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
    app.use(express.static(`${root}/images`));
    app.use(cors());
  }

  router(routes:any){
    this.routes = routes;
    return this;
  }

  listen(port:number | string = process.env.PORT || 3000){
    const welcome = (p:number | string) => () => {
      l.info(`up and running in ${'development'} @: ${os.hostname()} on port: ${p}}`
      );
    }
    oas(app,this.routes)
    .then(() => {
      http.createServer(app).listen(port,welcome(port))
    })
    .catch((err) => {
      l.error(err);
      process.exit(1);
    })
    return app;
  }

}
import l from '../../common/logger';
import db from './hidr8.db.service';
import {hidr8Data} from '../../interfaces/hidr8/createWaitlist'

class Hidr8Service{
  addHidr8Waitlist(data:hidr8Data){
    l.info(`${this.constructor.name}.addHidr8Waitlist()`)
    return db.addHidr8Waitlist(data);
  }

  allWaitingRequests(page:number,perPage:number) {
    l.info(`${this.constructor.name}.allWaitingRequests()`);
    return db.allWaitingRequests(page,perPage);
  }

  waitingDetails(uniqueId:number) {
    l.info(`${this.constructor.name}.waitingDetails(${uniqueId})`);
    return db.waitingDetails(uniqueId);
  }
}

export default new Hidr8Service()
import l from '../../common/logger';
import db from './client.db.service';
import { ClientData } from '../../interfaces/client/createClient';

class ClientService {
  clientRequest(data: ClientData) {
    l.info(`${this.constructor.name}.clientRequest()`);
    return db.clientRequest(data);
  }

  getAllClients(page: number, perPage: number) {
    l.info(`${this.constructor.name}.getAllClients()`);
    return db.getAllClients(page, perPage);
  }

  getClientDetail(clientId: number) {
    l.info(`${this.constructor.name}.getClientDetail(${clientId})`);
    return db.getClientDetail(clientId);
  }
}

export default new ClientService();

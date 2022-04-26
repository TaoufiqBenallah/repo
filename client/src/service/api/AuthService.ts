import BaseService from '@/service/api/BaseService';
import {AxiosPromise} from 'axios';

export default class AuthService extends BaseService {
  static authenticate(token: string): AxiosPromise<any> {
    return this.post('/token', {
      token: token,
    });
  }
}

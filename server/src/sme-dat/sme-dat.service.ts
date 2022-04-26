import { HttpService, Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as qs from 'qs';

dotenv.config();

@Injectable()
export class SmeDatService {
  constructor(private httpService: HttpService) {}

  private readonly logger = new Logger(SmeDatService.name);

  async getClientCredentials() {
    const data = qs.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.SME_DAT_API_CLIENT_ID,
      client_secret: process.env.SME_DAT_API_CLIENT_SECRET,
      scope: 'test/customers.read',
    });
    try {
      const request = this.httpService.post(
        `${process.env.SME_DAT_OAUTH_URL}/oauth2/token`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      const response = await request.toPromise();
      return response.data;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
  
  async sendOffers(data: any, token: string) {
    try {
      const request = this.httpService.post(
        `${process.env.SME_DAT_API_URL}/offers`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const response = await request.toPromise();
      return response.data;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}

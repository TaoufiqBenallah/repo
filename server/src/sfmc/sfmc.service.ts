import { Injectable } from '@nestjs/common';
// @ts-ignore
import * as ET_Client from 'sfmc-fuelsdk-node';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SFMCService {
  readonly client;

  constructor() {
    this.client = new ET_Client(
      process.env.SFMC_CLIENT_ID,
      process.env.SFMC_CLIENT_SECRET,
      process.env.STACK,
      {
        origin: `https://${process.env.SFMC_SUBDOMAIN}.rest.marketingcloudapis.com/`,
        authOrigin: `https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/`,
        authOptions: {
          authVersion: 2,
          accountId: process.env.SFMC_ACCOUNT_ID,
        },
      },
    );

    this.client.FuelAuthClient.getAccessToken(this.client.FuelAuthClient);
  }

  async saveData(externalKey: string, data: any) {
    return this.client.RestClient.post({
      uri: `/hub/v1/dataevents/key:${externalKey}/rowset`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      body: data,
    });
  }

  async getJourneyData(journeyId: string) {
    return this.client.RestClient.get({
      uri: `/interaction/v1/interactions/${journeyId}`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  }
}

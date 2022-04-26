import {
  Injectable,
  Logger,
  HttpService,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Entry } from './interfaces/entry.interface';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import * as dotenv from 'dotenv';
import { SFMCService } from '../sfmc/sfmc.service';
import { EntryService } from '../entry/entry.service';
import { EntryDTO } from '../entry/entry.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SmeDatService } from '../sme-dat/sme-dat.service';

dotenv.config();

@Injectable()
export class JourneyService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
    private entryService: EntryService,
    private smeDatService: SmeDatService,
  ) {}

  private readonly logger = new Logger(JourneyService.name);
  private readonly SFMCService = new SFMCService();

  async execute(data: any) {
    const extraId = uuidv4();

    const entry = EntryDTO.from({
      id: extraId,
      contactKey: data.contactKey,
      journeyId: data.journeyId,
      versionId: data.definitionInstanceId,
      activityId: data.activityObjectID,
      
      offerId: data.offerId,
      customerName: data.customerName,
      rmName: data.rmName,
      offerName: data.offerName,
      productName: data.productName,
      beginningDate: data.beginningDate,
      endDate: data.endDate,
      channel: data.channel,
      actionStatus: data.actionStatus,
      actionDetail: data.actionDetail,
      
      reprocessCount: 0,
    });

    try {
      await this.entryService.create(entry);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async isTokenValid(token: string) {
    try {
      const request = this.httpService.get(
        `https://${process.env.SFMC_SUBDOMAIN}.rest.marketingcloudapis.com/platform/v1/tokenContext`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const response = await request.toPromise();

      return response.data ? true : false;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.log('Cron processing');

    const entries = await this.entryService.getAll();
    const result: any = {};

    if (!entries.length) {
      this.logger.log('No new records');
      return;
    }

    await this.entryService.remove(entries);

    const groupedEntries = this.groupBy(entries, 'activityId');

    for (const [activityId, objects] of Object.entries(groupedEntries)) {
      const items = objects as any;
      const firstItem = items.length > 0 ? items[0] : null;

      const requestBody = {
        id: firstItem.id,
        date: new Date().toISOString(),
        offers: this.mapOffers(items)
      }
 
      let sendOffersResponse = null;
      let accepted = false;

      try {

        let accessToken: any = await this.cacheManager.get(`access-token`);

        if (!accessToken) {
          this.logger.log('Getting access token');
          const credentialsData = await this.smeDatService.getClientCredentials();
          await this.cacheManager.set(`access-token`, credentialsData.access_token, { ttl: credentialsData.expires_in - 200 });
          accessToken = credentialsData.access_token;
        }

        sendOffersResponse = await this.smeDatService.sendOffers(
          requestBody,
          accessToken
        );
      } catch (err) {
        this.logger.error(err);
      }
      try {
        if (sendOffersResponse) {
          accepted = true;
        }

        const itemsToSave: any = items.map((item) => {
          return {
            keys: {
              extra_id: item.id,
              customerId: item.contactKey,
              journeyVersionId: item.versionId,
              activityId: item.activityId,
              offerId: item.offerId,
            },
            values: {  
              customerName: item.customerName,
              rmName: item.rmName,
              offerName: item.offerName,
              productName: item.productName,
              beginningDate: item.beginningDate,
              endDate: item.endDate,
              channel: item.channel,
              actionStatus: item.actionStatus,
              actionDetail: item.actionDetail,
              accepted,
            }
          };
        });
      
        await this.SFMCService.saveData(process.env.DATA_EXTENSION_SEND_LOG, itemsToSave)
          .then((response) => {
            this.logger.log(`Data log saved`);
          })
          .catch((error) => {
            this.logger.error(error);
          });
      } catch (e) {
        this.logger.error(e);
      }
    }
  }

  mapOffers(items: EntryDTO[]) {
    return items.map((item) => {
      return {
        id: uuidv4(),
        customerId: item.contactKey,
        offerId: item.offerId,
        customerName: item.customerName,
        rmName: item.rmName,
        offerName: item.offerName,
        productName: item.productName,
        beginningDate: item.beginningDate,
        endDate: item.endDate,
        channel: item.channel,
        actionStatus: item.actionStatus,
        actionDetail: item.actionDetail,
      }
    })
  }

  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  validate(entry: Entry) {
    let entryData: any = {};

    let isValid = true;

    const allowedRootObjectKeys = [
      'inArguments',
      'outArguments',
      'activityId',
      'journeyId',
      'activityObjectID',
      'definitionInstanceId',
      'activityInstanceId',
      'keyValue',
      'mode',
    ];

    for (const key of Object.keys(entry)) {
      if (!allowedRootObjectKeys.includes(key)) {
        isValid = false;
      }
    }

    Object.entries(entry.inArguments).forEach(([key, value]: any) => {
      entryData = { ...entryData, ...value };
    });

    Object.entries(entry.outArguments).forEach(([key, value]: any) => {
      entryData = { ...entryData, ...value };
    });

    const allowedTreeObjectKeys = [
      'offerId',
      'customerName',
      'rmName',
      'offerName',
      'productName',
      'beginningDate',
      'channel',
      'endDate',
      'actionStatus',
      'actionDetail',
      'contactKey',
      'PublicationId',
      'DefinitionInstanceId',
      'VersionNumber',
    ];

    for (const key of Object.keys(entryData)) {
      if (!allowedTreeObjectKeys.includes(key)) {
        isValid = false;
      }
    }

    if (
      typeof entryData.offerId !== 'string' ||
      entryData.offerId.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.customerName !== 'string' ||
      entryData.customerName.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.rmName !== 'string' ||
      entryData.rmName.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.offerName !== 'string' ||
      entryData.offerName.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.productName !== 'string' ||
      entryData.productName.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.beginningDate !== 'string' ||
      entryData.beginningDate.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.channel !== 'string' ||
      entryData.channel.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.endDate !== 'string' ||
      entryData.endDate.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.actionStatus !== 'string' ||
      entryData.actionStatus.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.actionDetail !== 'string' ||
      entryData.actionDetail.length > 512
    ) {
      isValid = false;
    }
    
    if (
      typeof entryData.contactKey !== 'string' ||
      entryData.contactKey.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.PublicationId !== 'string' ||
      entryData.PublicationId.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.DefinitionInstanceId !== 'string' ||
      entryData.DefinitionInstanceId.length > 512
    ) {
      isValid = false;
    }
    if (
      typeof entryData.VersionNumber !== 'string' ||
      entryData.VersionNumber.length > 512
    ) {
      isValid = false;
    }

    return isValid;
  }

  sanitize(entry: Entry): any {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '/',
    };
    const reg = /[&<>"'/]/gi;

    const sanitizedData: any = {
      offerId: '',
      customerName: '',
      rmName: '',
      offerName: '',
      productName: '',
      beginningDate: '',
      endDate: '',
      channel: '',
      actionStatus: '',
      actionDetail: '',

      contactKey: '',
      PublicationId: '',
      DefinitionInstanceId: '',
      VersionNumber: '',

      activityId: '',
      journeyId: '',
      activityObjectID: '',
      definitionInstanceId: '',
      activityInstanceId: '',
      keyValue: '',
      mode: 0,
    };

    for (const [key, value] of Object.entries(entry)) {
      if (typeof value === 'string') {
        sanitizedData[key] = value.replace(reg, (match) => map[match]);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitizedData[key] = value;
      }
    }

    let entryData = {
      offerId: '',
      customerName: '',
      rmName: '',
      offerName: '',
      productName: '',
      beginningDate: '',
      endDate: '',
      channel: '',
      actionStatus: '',
      actionDetail: '',

      contactKey: '',
      PublicationId: '',
      DefinitionInstanceId: '',
      VersionNumber: '',
    };

    Object.entries(entry.inArguments).forEach(([key, value]: any) => {
      entryData = { ...entryData, ...value };
    });

    Object.entries(entryData).forEach(([key, value]: any) => {
      sanitizedData[key] = value.replace(
        reg,
        (match) => map[match],
      );
    });

    return sanitizedData;
  }
}

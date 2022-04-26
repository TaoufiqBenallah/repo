import { IsString, IsUUID, IsNumber } from 'class-validator';
import { Entry } from '../model/entry.entity';

export class EntryDTO implements Readonly<EntryDTO> {
  @IsUUID()
  id: string;

  @IsString()
  contactKey: string;

  @IsString()
  activityId: string;

  @IsString()
  journeyId: string;

  @IsString()
  versionId: string;

  @IsString()
  offerId: string;

  @IsString()
  customerName: string;

  @IsString()
  rmName: string;

  @IsString()
  offerName: string;

  @IsString()
  productName: string;

  @IsString()
  beginningDate: string;

  @IsString()
  endDate: string;

  @IsString()
  channel: string;
  
  @IsString()
  actionStatus: string;

  @IsString()
  actionDetail: string;

  @IsNumber()
  reprocessCount: any;

  public static from(dto: Partial<EntryDTO>) {
    const en = new EntryDTO();
    en.id = dto.id;
    en.contactKey = dto.contactKey;
    en.activityId = dto.activityId;
    en.journeyId = dto.journeyId;
    en.versionId = dto.versionId;
    en.offerId = dto.offerId;
    en.customerName = dto.customerName;
    en.rmName = dto.rmName;
    en.offerName = dto.offerName;
    en.productName = dto.productName;
    en.beginningDate = dto.beginningDate;
    en.endDate = dto.endDate;
    en.channel = dto.channel;
    en.actionStatus = dto.actionStatus;
    en.actionDetail = dto.actionDetail;
    en.reprocessCount = dto.reprocessCount;
    return en;
  }

  public static fromEntity(entity: Entry) {
    return this.from({
      id: entity.id,
      contactKey: entity.contactKey,
      activityId: entity.activityId,
      journeyId: entity.journeyId,
      versionId: entity.versionId,
      offerId: entity.offerId,
      customerName: entity.customerName,
      rmName: entity.rmName,
      offerName: entity.offerName,
      productName: entity.productName,
      beginningDate: entity.beginningDate,
      endDate: entity.endDate,
      channel: entity.channel,
      actionStatus: entity.actionStatus,
      actionDetail: entity.actionDetail,
      reprocessCount: entity.reprocessCount,
    });
  }

  public toEntity(increaseReprocess: boolean = false) {
    const en = new Entry();
    en.id = this.id;
    en.contactKey = this.contactKey;
    en.activityId = this.activityId;
    en.journeyId = this.journeyId;
    en.versionId = this.versionId;
    en.offerId = this.offerId;
    en.customerName = this.customerName;
    en.rmName = this.rmName;
    en.offerName = this.offerName;
    en.productName = this.productName;
    en.beginningDate = this.beginningDate;
    en.endDate = this.endDate;
    en.channel = this.channel;
    en.actionStatus = this.actionStatus;
    en.actionDetail = this.actionDetail;
    if (increaseReprocess) {
      en.reprocessCount = this.reprocessCount + 1;
    } else {
      en.reprocessCount = this.reprocessCount;
    }
    // en.createDateTime = new Date();

    return en;
  }
}

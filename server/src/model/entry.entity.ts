import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'entry' })
export class Entry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 512 })
  contactKey: string;

  @Column({ type: 'varchar', length: 512 })
  activityId: string;

  @Column({ type: 'varchar', length: 512 })
  journeyId: string;

  @Column({ type: 'varchar', length: 512 })
  versionId: string;

  @Column({ type: 'varchar', length: 512 })
  offerId: string;

  @Column({ type: 'varchar', length: 512 })
  customerName: string;

  @Column({ type: 'varchar', length: 512 })
  rmName: string;

  @Column({ type: 'varchar', length: 512 })
  offerName: string;

  @Column({ type: 'varchar', length: 512 })
  productName: string;

  @Column({ type: 'varchar', length: 512 })
  beginningDate: string;

  @Column({ type: 'varchar', length: 512 })
  endDate: string;

  @Column({ type: 'varchar', length: 512 })
  channel: string;

  @Column({ type: 'varchar', length: 512 })
  actionStatus: string;

  @Column({ type: 'varchar', length: 512 })
  actionDetail: string;

  @Column({ type: 'integer' })
  reprocessCount: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;
}
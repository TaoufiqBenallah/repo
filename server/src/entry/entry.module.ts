import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryService } from './entry.service';
import { Entry } from '../model/entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entry])],
  providers: [EntryService],
  exports: [EntryService],
})
export class EntryModule {}

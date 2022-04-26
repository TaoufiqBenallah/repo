import { Module } from '@nestjs/common';
import { SFMCService } from './sfmc.service';

@Module({
  providers: [SFMCService],
})
export class SFMCModule {}

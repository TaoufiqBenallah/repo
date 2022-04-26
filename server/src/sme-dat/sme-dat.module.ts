import { HttpModule, Module } from '@nestjs/common';
import { SmeDatService } from './sme-dat.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  providers: [SmeDatService],
  exports: [SmeDatService],
})
export class SmeDatModule {}

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JourneyModule } from './journey/journey.module';
import { SFMCModule } from './sfmc/sfmc.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { EntryModule } from './entry/entry.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SmeDatModule } from './sme-dat/sme-dat.module';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ScheduleModule.forRoot(),
    JourneyModule,
    SFMCModule,
    EntryModule,
    SmeDatModule,
  ],
})
export class AppModule {}

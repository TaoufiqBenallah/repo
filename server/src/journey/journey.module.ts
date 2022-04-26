import { Module, CacheModule, HttpModule } from '@nestjs/common';
import { JourneyController } from './journey.controller';
import { JourneyService } from './journey.service';
import { JwtModule } from '@nestjs/jwt';
import { EntryModule } from '../entry/entry.module';
import { SmeDatModule } from '../sme-dat/sme-dat.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.WP_JWT }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_TOKEN,
      port: process.env.REDIS_PORT,
      ttl: 100000000000000,
      tls: { checkServerIdentity: () => undefined }
    }),
    EntryModule,
    SmeDatModule,
  ],
  controllers: [JourneyController],
  providers: [JourneyService],
  exports: [JourneyService],
})
export class JourneyModule {}

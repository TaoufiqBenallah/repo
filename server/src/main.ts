import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  const logger = new Logger('Bootstrap');
  const sfmcStack = process.env.STACK;
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'frame-ancestors': [
            "'self'",
            `https://mc.${sfmcStack}.exacttarget.com`,
            `https://jbinteractions.${sfmcStack}.marketingcloudapps.com`,
          ],
          'img-src': ["'self'"],
        },
      },
    }),
  );

  // app.use(bodyParser.json());
  app.use(
    bodyParser.raw({
      type: 'application/jwt',
    }),
  );

  app.use('/token', bodyParser.json());

  // middleware checking content-type
  app.use('/journey/', (req, res, next) => {
    const contentType = req.headers['content-type'];
    if (!contentType || contentType.indexOf('application/jwt') !== 0) {
      logger.log('Invalid content type')
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    next();
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

import {
  Controller,
  Logger,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JwtService } from '@nestjs/jwt';

@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}
  private readonly logger = new Logger(JourneyController.name);
  private readonly jwt = new JwtService({
    secret: process.env.JWT,
  });

  @Post('validate')
  async validate(@Body() body) {
    this.logger.debug('validate');
    await this.jwt.verifyAsync(body.toString());
    return {
      status: 'ok',
    };
  }

  @Post('save')
  async save(@Body() body) {
    this.logger.debug('save');
    await this.jwt.verifyAsync(body.toString());
    return {
      status: 'ok',
    };
  }

  @Post('publish')
  async publish(@Body() body) {
    this.logger.debug('publish');
    await this.jwt.verifyAsync(body.toString());
    return {
      status: 'ok',
    };
  }

  @Post('stop')
  async stop(@Body() body) {
    this.logger.debug('stop');
    await this.jwt.verifyAsync(body.toString());
    return {
      status: 'ok',
    };
  }

  @Post('execute')
  async execute(@Body() body) {
    const start = process.hrtime.bigint();
    this.logger.debug('execute');
    
    const data = await this.jwt.verifyAsync(body.toString());
    const isInputValid = this.journeyService.validate(data);

    if (!isInputValid) {
      this.logger.error('Bad request');
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    const sanitizedData = this.journeyService.sanitize(data);

    await this.journeyService.execute(sanitizedData);

    const end = process.hrtime.bigint();
    this.logger.debug(
      `Execute function took ${Number(end - start) / 1000000}ms`,
    );

    this.logger.debug('Return from execute');
    return { status: 'ok' };
  }
}

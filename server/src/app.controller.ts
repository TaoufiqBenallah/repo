import * as fs from 'fs';
import * as path from 'path';
import {
  Controller,
  Logger,
  Headers,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JourneyService } from './journey/journey.service';

@Controller()
export class AppController {
  constructor(private readonly journeyService: JourneyService) {}
  private readonly logger = new Logger(AppController.name);

  @Get('config.json')
  async config(@Headers() headers) {
    const file = path.join(__dirname, '..', 'public', 'config-template.json');

    const configTemplate = fs.readFileSync(file, 'utf-8');
    return JSON.parse(
      configTemplate
        .replace(/\$DOMAIN/g, process.env.DOMAIN)
        .replace(/\$JWT_CUSTOMER_KEY/g, process.env.JWT_CUSTOMER_KEY)
    );
  }

  @Post('token')
  async authenticate(@Body() body) {
    this.logger.debug('token');

    const isTokenValid = await this.journeyService.isTokenValid(body.token);

    if (!isTokenValid) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return {
      status: 'ok',
    };
  }

  @Get('mgmt/health')
  async health() {
    return {
      status: 'ok',
    };
  }
}

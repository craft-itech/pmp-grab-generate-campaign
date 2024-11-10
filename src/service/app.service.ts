import { Injectable } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { NestjsWinstonLoggerService, InjectLogger } from "nestjs-winston-logger";

@Injectable()
export class AppService {

  constructor(
    private readonly rmqService: RmqService,
    @InjectLogger(AppService.name) private logger: NestjsWinstonLoggerService
  ) { }

  getHello(): string {
    this.logger.debug('Debug');
    return 'Hello World!';
  }
}
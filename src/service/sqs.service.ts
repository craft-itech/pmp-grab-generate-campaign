import { Injectable } from "@nestjs/common";
import { SqsService } from '@ssut/nestjs-sqs';
import { InjectLogger, NestjsWinstonLoggerService } from "nestjs-winston-logger";

@Injectable()
export class SqsPublisherService {
    constructor(
         private sqsService: SqsService,
         @InjectLogger(SqsPublisherService.name) private logger: NestjsWinstonLoggerService
    ) {}
    async publish(queue: string, payload: any) {
        const msg : any = JSON.stringify(payload);
        this.logger.log('Publish sqs to ' + queue + ' : ' + msg);
      
        const result = await this.sqsService.send(queue, payload);
        this.logger.log('Result from publish sqs to ' + queue + ' : ' + JSON.stringify(result))
    }
}    
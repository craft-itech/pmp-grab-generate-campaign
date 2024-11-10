import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { InjectLogger, NestjsWinstonLoggerService } from "nestjs-winston-logger";
import { InPutKafka } from "src/dtos/inputkafka";
import { InPutKafkaAny } from "src/dtos/inptukafkaany";
import { GenerateCampaignService } from "./generate-campaign.service";

@Injectable()
export class RmqService {
    constructor(
        private readonly genCampaignService: GenerateCampaignService,
        @InjectLogger(RmqService.name) private logger: NestjsWinstonLoggerService
    ) {
    }

    @RabbitSubscribe({
        queue: '', //queue name
        createQueueIfNotExists: false,
    })
    public async pubSubHandlerCampaign(payload: InPutKafkaAny) {
        this.logger.debug(`Received Campaign pub/sub message: `);
        this.logger.debug(JSON.stringify(payload))

        try {
            await this.genCampaignService.crateCampaign(payload)
        }
        catch (error) {
            this.logger.error('Error msg :' + error);
        }
    }
}
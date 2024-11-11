import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GenerateCampaignService } from "./generate-campaign.service";

@Injectable()
export class RmqService {
    constructor(
        private readonly genCampaignService: GenerateCampaignService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    ) {
    }

    @RabbitSubscribe({
        queue: process.env.CAMPAIGN_QUEUE, //queue name
        createQueueIfNotExists: false,
    })
    public async pubSubHandlerCampaign(payload: string) {
        console.log("----------------");
        this.logger.debug(`Received Campaign pub/sub message: `);
        this.logger.debug(payload);

        try {
            await this.genCampaignService.readCampaign(payload)
        }
        catch (error) {
            this.logger.error('Error msg :' + error);
        }
    }
}
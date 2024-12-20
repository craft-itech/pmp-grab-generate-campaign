import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GenerateCampaignService } from "./generate-campaign.service";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class RmqService {
    constructor(
        private readonly genCampaignService: GenerateCampaignService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    ) {
    }

    /*
    @RabbitSubscribe({
        exchange: "cg.pmp.campaign.dx",
        routingKey: "00.10.06.12.01.00",
        queue: "cg.pmp.campaign.grabmart.init.q",
        createQueueIfNotExists: false,
    })
    public async pubSubHandlerCampaign(payload) {
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
        */
}
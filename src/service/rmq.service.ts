import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { InjectLogger, NestjsWinstonLoggerService } from "nestjs-winston-logger";
import { InPutKafka } from "src/dtos/inputkafka";
import { InPutKafkaAny } from "src/dtos/inptukafkaany";
import { GenerateCampaignService } from "./generate-campaign.service";

@Injectable()
export class RmqService {
    constructor(
        private readonly topsOnlineService: GenerateCampaignService,
        @InjectLogger(RmqService.name) private logger: NestjsWinstonLoggerService
    ) {
    }

    @RabbitSubscribe({
        queue: 'cg.pmp.product.topsonline.adapter.req.q',
        createQueueIfNotExists: false,
    })
    public async pubSubHandlerProduct(payload: InPutKafka) {
        this.logger.debug(`Received Product pub/sub message: `);
        this.logger.debug(JSON.stringify(payload))
        try {
            await this.topsOnlineService.crateProduct(payload);
        }
        catch (error) {
            this.logger.error('Error msg :' + error);
        }
    }

    @RabbitSubscribe({
        queue: 'cg.pmp.price.topsonline.adapter.req.q',
        createQueueIfNotExists: false,
    })
    public async pubSubHandlerPrice(payload: InPutKafkaAny) {
        this.logger.debug(`Received Price pub/sub message: `);
        this.logger.debug(JSON.stringify(payload))

        try {
            await this.topsOnlineService.cratePrice(payload)
        }
        catch (error) {
            this.logger.error('Error msg :' + error);
        }
    }
    
    @RabbitSubscribe({
        queue: 'cg.pmp.promotion.topsonline.adapter.req.q',
        createQueueIfNotExists: false,
    })
    public async pubSubHandlerPromotion(payload: InPutKafkaAny) {
        this.logger.debug(`Received Promotion pub/sub message: `);
        this.logger.debug(JSON.stringify(payload))

        try {
            await this.topsOnlineService.cratePromotion(payload)
        }
        catch (error) {
            this.logger.error('Error msg :' + error);
        }
    }

    @RabbitSubscribe({
        queue: 'cg.pmp.promotion.topsonline.cancel.adapter.req.q',
        createQueueIfNotExists: false,
    })
    public async pubSubHandlerCancelPromotion(payload: InPutKafkaAny) {
        this.logger.debug(`Received pub/sub message: `);
        this.logger.debug(JSON.stringify(payload))
        try {
            await this.topsOnlineService.crateCancelPromotion(payload)
        }
        catch (error) {
            this.logger.error('Error msg :' + error);
        }
    }

    @RabbitSubscribe({
        queue: 'cg.pmp.coupon.topsonline.adapter.req.q',
        createQueueIfNotExists: false,
    })
    public async pubSubHandlerCoupon(payload: InPutKafkaAny) {
        this.logger.debug(`Received Coupon pub/sub message: `);
        this.logger.debug(JSON.stringify(payload))

        try {
            await this.topsOnlineService.crateCoupon(payload)
        }
        catch (error) {
            this.logger.error('Error msg :' + error);
        }
    }

    @RabbitSubscribe({
        queue: 'cg.pmp.campaign.topsonline.adapter.req.q',
        createQueueIfNotExists: false,
    })
    public async pubSubHandlerCampaign(payload: InPutKafkaAny) {
        this.logger.debug(`Received Campaign pub/sub message: `);
        this.logger.debug(JSON.stringify(payload))

        try {
            await this.topsOnlineService.crateCampaign(payload)
        }
        catch (error) {
            this.logger.error('Error msg :' + error);
        }
    }

    @RabbitSubscribe({
        queue: 'cg.pmp.product.topsonline.locstatus.adapter.req.q',
        createQueueIfNotExists: false,
    })
    public async pubSubHandlerLocStatus(payload: InPutKafkaAny) {
        this.logger.debug(`Received Loc pub/sub message: `);
        this.logger.debug(JSON.stringify(payload))

        try {
            await this.topsOnlineService.crateLocStatus(payload)
        }
        catch (error) {
            this.logger.error('Error msg :' + error);
        }
    }
}
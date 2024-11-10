import { Injectable } from '@nestjs/common';
import { AttributeResponse } from '../type/attributeResp';
import { Attribute } from '../type/attribute';
import { Option } from '../type/option';
import { InPutKafka } from '../dtos/inputkafka';
import { InPutKafkaAny } from '../dtos/inptukafkaany';
import { SqsPublisherService } from './sqs.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { kafkaConfig } from '../module/kafka.config';
import {
  InjectLogger,
  NestjsWinstonLoggerService,
} from 'nestjs-winston-logger';
import { Client, ClientKafka } from '@nestjs/microservices';
import { GrabCampaignDto } from 'src/dtos/grab/grab-campaign.dto';
import { QuotaDto } from 'src/dtos/grab/quota/quota.dto';
import { ConditionDto } from 'src/dtos/grab/condition/condition.dto';
import { DiscountDto } from 'src/dtos/grab/discount/discount.dto';
import { PromotionGrabmartEntity } from 'src/entity/promotion_grabmart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GenerateCampaignService {
  constructor(
    @InjectRepository(PromotionGrabmartEntity)
    private readonly promotionGrabmartRepository: Repository<PromotionGrabmartEntity>,
    private readonly amqpConnection: AmqpConnection,
    private readonly sqsService: SqsPublisherService,
    @InjectLogger(GenerateCampaignService.name)
    private logger: NestjsWinstonLoggerService,
  ) {}

	@Client(kafkaConfig)
	    clientKafka: ClientKafka;

      addVal: string;
  createOutput: any;
  createimgOutput: any;

  async crateCampaign(inPutKafka: InPutKafkaAny) {
    await this.sqsService.publish(process.env.campaign_queue, inPutKafka);

    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_canpaign_queue + " with message [" + JSON.stringify(inPutKafka) + "].");
    this.clientKafka.emit(process.env.kafka_canpaign_queue, JSON.stringify(inPutKafka));
    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_canpaign_queue + " successfully.");

    await this.amqpConnection.publish(
      process.env.exchangesNameCampaign,
      process.env.exchangeRouteCampaign,
      inPutKafka,
    );
  }

  async setGrabCampaign(entity: PromotionGrabmartEntity): Promise<GrabCampaignDto> {
        // Simulate an asynchronous operation (like fetching data)
        const fetchedQuotas: QuotaDto = await this.getQuotas();
        const fetchedConditions: ConditionDto = await this.getConditions();
        const fetchedDiscount: DiscountDto = await this.getDiscount();
        
        // Return the populated GrabCampaignDto
        const campaignDto = new GrabCampaignDto();
        campaignDto.id = entity.campaign_id;
        campaignDto.createdBy = "user123";
        campaignDto.merchantID = entity.merchant_id;
        campaignDto.name = "Holiday Sale";
        campaignDto.quotas = fetchedQuotas;
        campaignDto.conditions = fetchedConditions;
        campaignDto.discount = fetchedDiscount;
        campaignDto.customTag = "holiday2024";

        return campaignDto;
    }

    // These methods are mockups for simulating data fetching
    private async getQuotas(): Promise<QuotaDto> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(new QuotaDto()), 1000); // Simulate async data fetch
        });
    }

    private async getConditions(): Promise<ConditionDto> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(new ConditionDto()), 1000); // Simulate async data fetch
        });
    }

    private async getDiscount(): Promise<DiscountDto> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(new DiscountDto()), 1000); // Simulate async data fetch
        });
    }

    async getPromotionsByMerchantId(merchantId: string): Promise<PromotionGrabmartEntity[]> {
      return await this.promotionGrabmartRepository.find({
        where: { merchant_id: merchantId },
        order: {
          promotion_mode: 'ASC',
          created_date: 'ASC',
        },
      });
    }
}

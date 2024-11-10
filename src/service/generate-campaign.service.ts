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

@Injectable()
export class GenerateCampaignService {
  constructor(
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
}

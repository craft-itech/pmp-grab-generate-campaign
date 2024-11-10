import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { NestjsWinstonLoggerModule } from 'nestjs-winston-logger';
import { RmqService } from 'src/service/rmq.service';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { format, transports } from "winston";
import { winstonAzureBlob } from 'winston-azure-blob';
import { ConfigModule } from '@nestjs/config';
import { UtilService } from 'src/service/util.sevice'
import { GenerateCampaignService } from 'src/service/generate-campaign.service';
import { SqsPublisherService } from 'src/service/sqs.service';
import * as AWS from 'aws-sdk';
import { SqsModule } from '@ssut/nestjs-sqs';
import { toZonedTime } from 'date-fns-tz'

AWS.config.update({
  region: process.env.awsRegion,
  accessKeyId: process.env.awsAccessKey,
  secretAccessKey: process.env.awsSecretKey,
});

@Module({
  imports: [ConfigModule.forRoot(),
  RabbitMQModule.forRoot(RabbitMQModule, {
    uri: process.env.uri,
  }),
       
  SqsModule.register(
    {
      consumers: [],
      producers: [
        {
          name: process.env.price_queue,
          queueUrl: process.env.sqsQueueUrl + process.env.price_queue, 
          region: process.env.sqsRegion,
        },
        {
          name: process.env.coupon_queue,
          queueUrl: process.env.sqsQueueUrl + process.env.coupon_queue, 
          region: process.env.sqsRegion,
        },
        {
          name: process.env.promotion_queue,
          queueUrl: process.env.sqsQueueUrl + process.env.promotion_queue, 
          region: process.env.sqsRegion,
        },
        {
          name: process.env.cancel_promotion_queue,
          queueUrl: process.env.sqsQueueUrl + process.env.cancel_promotion_queue, 
          region: process.env.sqsRegion,
        },
        {
          name: process.env.image_queue,
          queueUrl: process.env.sqsQueueUrl + process.env.image_queue, 
          region: process.env.sqsRegion,
        },
        {
          name: process.env.product_queue,
          queueUrl: process.env.sqsQueueUrl + process.env.product_queue, 
          region: process.env.sqsRegion,
        },
        {
          name: process.env.loc_queue,
          queueUrl: process.env.sqsQueueUrl + process.env.loc_queue, 
          region: process.env.sqsRegion,
        },
        {
          name: process.env.campaign_queue,
          queueUrl: process.env.sqsQueueUrl + process.env.campaign_queue, 
          region: process.env.sqsRegion,
        },
      ]
    }),
        
  NestjsWinstonLoggerModule.forRoot({
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), // Customize timestamp format
      format.printf(info => {
        const { level, message, context, timestamp } = info;
        let gmtDate = toZonedTime(new Date(), 'Asia/Bangkok').toISOString();
        let color = '';
        switch (level) {
          case 'error':
            color = '\x1b[31m'; // Red
            break;
          case 'warn':
            color = '\x1b[33m'; // Yellow
            break;
          case 'debug':
            color = '\x1b[36m'; // Cyan
            break;
          case 'verbose':
            color = '\x1b[90m'; // Gray
            break;
          default:
            color = '\x1b[32m'; // Green (info)
        }
        return `${color}[${gmtDate}] ${level.toUpperCase()}: ${context ? `${context} - ` : ''}${message}\x1b[0m`;
      }),      
    ),
    transports: [
      new transports.Console({level: process.env.transportsLevelConsole}),
      winstonAzureBlob({
        account: {
          name: process.env.transportsAccountName,
          key: process.env.transportsAccountKey
        },
        containerName: 'pmplogs',
        blobName: process.env.transportsBlobName,
        level: process.env.transportsLevelBlob,
        bufferLogSize : 1,
        syncTimeout : 0,
        rotatePeriod : 'YYYY-MM-DD-HH',
        eol : '\n'
      })
    ],
  }),
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    RmqService, 
    SqsPublisherService,
    UtilService, 
    GenerateCampaignService],
})
export class AppModule {}

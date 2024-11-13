import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { RmqService } from 'src/service/rmq.service';
import { AppController } from '../controller/app.controller';
import { format, transports } from "winston";
import { winstonAzureBlob } from 'winston-azure-blob';
import { ConfigModule } from '@nestjs/config';
import { UtilService } from 'src/service/util.sevice'
import { GenerateCampaignService } from 'src/service/generate-campaign.service';
import { toZonedTime } from 'date-fns-tz'
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionGrabmartEntity } from 'src/entity/promotion_grabmart.entity';
import { TypeOrmConfigService } from 'src/typeorm/typeorm.service';
import { WinstonModule } from 'nest-winston';
import { HttpModule } from '@nestjs/axios';
import { MasterGrabmartEntity } from 'src/entity/master_grabmart.entity';

@Module({
  imports: [ConfigModule.forRoot(),
    
  RabbitMQModule.forRoot(RabbitMQModule, {
    uri: process.env.RMQ_URI,
    channels: {
      "channel-1": {
        prefetchCount: 1,
        default: true,
      },
    },
  }),

  HttpModule.register({
    timeout: 3000,
  }),
               
  WinstonModule.forRoot({
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
      new transports.Console({ level: process.env.LOG_LEVEL }),
      winstonAzureBlob({
        account: {
          name: process.env.AZURE_LOG_ACCOUNT_NAME,
          key: process.env.AZURE_LOG_ACCOUNT_KEY,
        },
        containerName: 'pmplogs',
        blobName: process.env.AZURE_LOG_BLOB_NAME,
        level: process.env.LOG_LEVEL,
        bufferLogSize: 1,
        syncTimeout: 0,
        rotatePeriod: 'YYYY-MM-DD-HH',
        eol: '\n',
      }),
    ],
}),
  TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
  TypeOrmModule.forFeature([PromotionGrabmartEntity, MasterGrabmartEntity]),
  ],
  controllers: [AppController],
  providers: [
    RmqService, 
    UtilService, 
    GenerateCampaignService],
})
export class AppModule {}

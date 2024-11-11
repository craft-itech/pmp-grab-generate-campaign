import { Injectable, HttpException, HttpStatus, Inject, LoggerService } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { GrabCampaignDto } from 'src/dtos/grab/grab-campaign.dto';
import { QuotaDto } from 'src/dtos/grab/quota/quota.dto';
import { ConditionDto } from 'src/dtos/grab/condition/condition.dto';
import { DiscountDto, DiscountDto } from 'src/dtos/grab/discount/discount.dto';
import { PromotionGrabmartEntity } from 'src/entity/promotion_grabmart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { UtilService } from './util.sevice';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class GenerateCampaignService {
  constructor(
    @InjectRepository(PromotionGrabmartEntity) 
    private readonly promotionGrabmartRepository: Repository<PromotionGrabmartEntity>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly utilService: UtilService,
  ) {}


  async readCampaign(merchantID: string) {
    this.logger.debug("Trigger merchantID : " + merchantID);
    const promotions: PromotionGrabmartEntity[] = await this.getPromotionsByMerchantId(merchantID);
    for(const promotion of promotions) {
      if(promotion.promotion_mode == "INSERT") {
        this.createCampaign(promotion, merchantID);
      } else {
        this.deleteCampaign(promotion.campaign_id, merchantID);
      }
    }
  }

  async createCampaign(promotion: PromotionGrabmartEntity, merchantID: string) {

    const url = "http://localhost/merchantID/";
    const grabCampaign: GrabCampaignDto = await this.setGrabCampaign(promotion);
    try {
      // Send POST request with grabCampaign as the body
      const response = await lastValueFrom(
        this.httpService.post(url, grabCampaign)
      );
      this.logger.debug("Successfully posted campaign for merchant ID: " + merchantID);
    } catch (error) {
      this.logger.error("Failed to post campaign for merchant ID: " + merchantID);
    }  
  }

  async deleteCampaign(campaignID: string, merchantID: string) {
    this.logger.debug("Delete merchantID : " + merchantID + "|" + campaignID);
    const url = "http://localhost/campaignID/"+campaignID;
    
    try {
      const response = await lastValueFrom(this.httpService.delete(url));
      if (response.status !== 200) {
        throw new HttpException('Failed to delete resource', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new HttpException(
        'Failed to delete merchant from external API',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setGrabCampaign(entity: PromotionGrabmartEntity): Promise<GrabCampaignDto> {
    // Simulate an asynchronous operation (like fetching data)
    const fetchedQuotas: QuotaDto = await this.getQuotas(entity);
    const fetchedConditions: ConditionDto = await this.getConditions(entity);
    const fetchedDiscount: DiscountDto = await this.getDiscount();
    
    // Return the populated GrabCampaignDto
    const campaignDto = new GrabCampaignDto();
    campaignDto.id = entity.campaign_id;
    campaignDto.createdBy = "PMP";
    campaignDto.merchantID = entity.merchant_id;
    campaignDto.name = entity.custom_tag;
    //campaignDto.quotas = fetchedQuotas;
    campaignDto.conditions = fetchedConditions;
    campaignDto.discount = fetchedDiscount;
    campaignDto.customTag = entity.custom_tag;

    return campaignDto;
  }

  private async getConditions(entity: PromotionGrabmartEntity): Promise<ConditionDto> {
    const inputDateFormat: string = 'yyyy-MM-dd HH:mm:ss';
    const grabDateFormat: string  = "yyyy-MM-dd'T'HH:mm:ssX";
    const strStartDate = entity.start_date + "00:00:00"
    const strEndDate = entity.end_date + "23:59:59"

    const conditions: ConditionDto = new ConditionDto;

    conditions.startTime = this.utilService.convertDateFormat(strStartDate, inputDateFormat, grabDateFormat);
    conditions.endTime = this.utilService.convertDateFormat(strEndDate, inputDateFormat, grabDateFormat);
    conditions.eaterType = 'all';
    if (entity.bundle_qty)
    conditions.bundleQuantity = entity.bundle_qty ? parseInt(entity.bundle_qty) : 0;

    return conditions;
  }

  private async getQuotas(entity: PromotionGrabmartEntity): Promise<QuotaDto> {
    const quota = new QuotaDto();

    return quota;
  }

  private async getDiscount(): Promise<DiscountDto> {
    const discount: DiscountDto = new DiscountDto();

    

    return discount;
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

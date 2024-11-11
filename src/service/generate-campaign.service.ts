import { Injectable, HttpException, HttpStatus, Inject, LoggerService } from '@nestjs/common';
import { GrabCampaignDto } from 'src/dtos/grab/grab-campaign.dto';
import { QuotaDto } from 'src/dtos/grab/quota/quota.dto';
import { ConditionDto } from 'src/dtos/grab/condition/condition.dto';
import { DiscountDto } from 'src/dtos/grab/discount/discount.dto';
import { PromotionGrabmartEntity } from 'src/entity/promotion_grabmart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { UtilService } from './util.sevice';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ScopeDto } from 'src/dtos/grab/discount/scope.dto';
import { lastValueFrom } from 'rxjs';
import { GrabCampaignResposneDto } from 'src/dtos/grab/grab-campaign-response.dto';

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
        this.deleteCampaign(promotion, merchantID);
      }
    }
  }

  async createCampaign(promotion: PromotionGrabmartEntity, merchantID: string) {

    const url = process.env.ADAPTER_URL + "/campaign";
    const grabCampaign: GrabCampaignDto = await this.setGrabCampaign(promotion);
    this.logger.debug("Create campaign : {}", grabCampaign);
    try {
      // Send POST request with grabCampaign as the body
      const response = await lastValueFrom(
        this.httpService.post<GrabCampaignResposneDto>(url, grabCampaign)
      );


      if (response.status === 200) {
        promotion.campaign_id = response.data.campaignID;
        promotion.status = 99;
  
        this.promotionGrabmartRepository.save(promotion);
  
        this.logger.debug("Successfully posted campaign for merchant ID: " + merchantID + " get campaign id: " + promotion.campaign_id);
      }
      else {
        this.logger.error("Failed to post campaign for merchant ID: " + merchantID + " response code: " + response.status);
        throw new HttpException('Failed to delete resource', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      this.logger.error("Failed to post campaign for merchant ID: " + merchantID, error);
      throw new HttpException(
        'Failed to delete merchant from external API',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }  
  }

  async deleteCampaign(promotion: PromotionGrabmartEntity, merchantID: string) {
    this.logger.debug("Delete merchantID : " + merchantID + " campaign id:" + promotion.campaign_id);
    const url = process.env.ADAPTER_URL + "/campaign/"+promotion.campaign_id;
    
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
    const fetchedConditions: ConditionDto = await this.getConditions(entity);
    const fetchedDiscount: DiscountDto = await this.getDiscount(entity);
    
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
    const grabDateFormat: string  = "yyyy-MM-dd'T'HH:mm:ss'Z'";
    const strStartDate = entity.start_date + " 00:00:00"
    const strEndDate = entity.end_date + " 23:59:59"

    const conditions: ConditionDto = new ConditionDto;

    conditions.startTime = this.utilService.checkAndAdjustDate(strStartDate, inputDateFormat, grabDateFormat);
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

  private async getDiscount(entity: PromotionGrabmartEntity): Promise<DiscountDto> {
    const discount: DiscountDto = new DiscountDto();

    discount.type = entity.grab_promotion_type;
    discount.value = parseInt(entity.campaign_value);
    discount.scope = await this.getScope(entity);

    return discount;
  }

  private async getScope(entity: PromotionGrabmartEntity): Promise<ScopeDto> {
    const scope: ScopeDto = new ScopeDto();

    scope.type = "items";
    scope.objectIDs = entity.barcode.split(',');

    return scope;
  }

  async getPromotionsByMerchantId(merchantId: string): Promise<PromotionGrabmartEntity[]> {
    return await this.promotionGrabmartRepository.find({
      where: { 
        merchant_id: merchantId,
        bu: process.env.BU
      },
      order: {
        promotion_mode: 'ASC',
        created_date: 'ASC',
      },
    });
  }
}

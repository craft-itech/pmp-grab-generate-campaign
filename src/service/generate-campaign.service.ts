import { Injectable, HttpException, HttpStatus, Inject, LoggerService } from '@nestjs/common';
import { GrabCampaignDto } from 'src/dtos/grab/grab-campaign.dto';
import { QuotaDto } from 'src/dtos/grab/quota/quota.dto';
import { ConditionDto } from 'src/dtos/grab/condition/condition.dto';
import { DiscountDto } from 'src/dtos/grab/discount/discount.dto';
import { PromotionGrabmartEntity } from 'src/entity/promotion_grabmart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { UtilService } from './util.sevice';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ScopeDto } from 'src/dtos/grab/discount/scope.dto';
import { lastValueFrom } from 'rxjs';
import { GrabCampaignResposneDto } from 'src/dtos/grab/grab-campaign-response.dto';
import { Period } from 'src/dtos/grab/condition/period.dto';
import { Day } from 'src/dtos/grab/condition/day.dto';
import { WorkingHour } from 'src/dtos/grab/condition/workinghour.dto';
import { MasterGrabmartEntity } from 'src/entity/master_grabmart.entity';
import { parse } from 'date-fns';

@Injectable()
export class GenerateCampaignService {
  private debounceTimeout;
  constructor(
    @InjectRepository(PromotionGrabmartEntity) 
    private readonly promotionGrabmartRepository: Repository<PromotionGrabmartEntity>,
    @InjectRepository(MasterGrabmartEntity) 
    private readonly masterGrabmartRepository: Repository<MasterGrabmartEntity>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly utilService: UtilService,
  ) {
    this.debounceTimeout = null;

    setInterval(() => {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(this.checkCampaign.bind(this), 60000);
    }, 60000);  
  }


  async checkCampaign() {
    const promotions = await this.promotionGrabmartRepository.find({
      where: { 
        bu: process.env.BU,
        status: 0
      },
      order: {
        promotion_mode: 'ASC',
        created_date: 'ASC',
      },
    });   
    
    this.logger.log("Found remain promotion to process : " + promotions.length)

    for (const promotion of promotions) {
      if (promotion.promotion_mode === 'DELETE') {
        await this.processCampaign(promotion);
      }
      else if (parse(promotion.end_date + " 23:59:59", "yyyy-MM-dd HH:mm:ss", new Date()).getTime() <= new Date().getTime()) {
        promotion.status = 103;
        promotion.updated_date = new Date();

        await this.promotionGrabmartRepository.save(promotion);
        this.logger.warn("Failed to post campaign for merchant ID: " + promotion.merchant_id + ' of ID ' + promotion.id + ' because end date already pass.');
      }
      else {
        const barcodes = promotion.barcode.split(',');

        let syncFinishCount = 0;
        for (const barcode of barcodes) {
          syncFinishCount = syncFinishCount + await this.masterGrabmartRepository.count({
            where: {
              status: LessThan(0),
              barcode: barcode,
              seller_id: promotion.merchant_id,
            }
          });
        }

        if (barcodes.length === syncFinishCount) {
          await this.processCampaign(promotion);
        }
        else {
          this.logger.debug('Promotion ' + promotion.promotion_no + ' of ID ' + promotion.id + ' has ' +barcodes.length + ' barcode(s) but master sync success ' + syncFinishCount);
        }
      }
    }
    
    //get campaign
    //check masteer
    //process promotion
  }

  async readCampaign(merchantID: string) {
    this.logger.debug("Trigger merchantID : " + merchantID);
    const promotions: PromotionGrabmartEntity[] = await this.getPromotionsByMerchantId(merchantID);
    for(const promotion of promotions) {
      await this.processCampaign(promotion);
    }
  }

  async processCampaign(promotion: PromotionGrabmartEntity) {
    if(promotion.promotion_mode === "INSERT") {
      await this.createCampaign(promotion, promotion.merchant_id);
    } else {
      await this.deleteCampaign(promotion, promotion.merchant_id);
    }
}

  async createCampaign(promotion: PromotionGrabmartEntity, merchantID: string) {

    const url = process.env.ADAPTER_URL + "/campaign";
    const grabCampaign: GrabCampaignDto = await this.setGrabCampaign(promotion);

    this.logger.debug("Create campaign : " + JSON.stringify(grabCampaign));
    try {
      // Send POST request with grabCampaign as the body
      const response = await lastValueFrom(
        this.httpService.post<GrabCampaignResposneDto>(url, grabCampaign)
      );


      if (response.status === 200) {
        promotion.campaign_id = response.data.campaignID;
        promotion.status = 99;
        promotion.updated_date = new Date();
  
        await this.promotionGrabmartRepository.save(promotion);
  
        this.logger.debug("Successfully posted campaign for merchant ID: " + merchantID  + ' of ID ' + promotion.id+ " get campaign id: " + promotion.campaign_id);
      }
      else {
        this.logger.error("Failed to post campaign for merchant ID: " + merchantID + ' of ID ' + promotion.id + " response code: " + response.status);
        throw new HttpException('Failed to delete resource', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      this.logger.error("Failed to post campaign for merchant ID: " + merchantID + ' of ID ' + promotion.id, error);
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
      else {
        promotion.status = 99;
        promotion.updated_date = new Date();
  
        await this.promotionGrabmartRepository.save(promotion);

        this.logger.debug("Successfully delete campaign for merchant ID: " + merchantID  + ' of ID ' + promotion.id+ " get campaign id: " + promotion.campaign_id);
      }
    } catch (error) {
      this.logger.error("Failed to delete campaign for campaign ID: " + promotion.campaign_id, error);
    }
  }

  async setGrabCampaign(entity: PromotionGrabmartEntity): Promise<GrabCampaignDto> {
    // Simulate an asynchronous operation (like fetching data)
    const fetchedConditions: ConditionDto = await this.getConditions(entity);
    const fetchedDiscount: DiscountDto = await this.getDiscount(entity);
    
    // Return the populated GrabCampaignDto
    const campaignDto = new GrabCampaignDto();
    campaignDto.id = entity.campaign_id;
    //campaignDto.createdBy = "PMP";
    campaignDto.merchantID = entity.merchant_id;
    campaignDto.name = entity.promotion_type;
    //campaignDto.quotas = fetchedQuotas;
    campaignDto.conditions = fetchedConditions;
    campaignDto.discount = fetchedDiscount;

    if (entity.grab_promotion_type.startsWith('bundle')) {
      campaignDto.customTag = entity.custom_tag;
    }

    return campaignDto;
  }

  private async getConditions(entity: PromotionGrabmartEntity): Promise<ConditionDto> {
    const inputDateFormat: string = 'yyyy-MM-dd HH:mm:ss';
    const grabDateFormat: string  = "yyyy-MM-dd'T'HH:mm:ss'Z'";
    const strStartDate = entity.start_date + " 00:00:00"
    const strEndDate = entity.end_date + " 23:59:59"

    const conditions: ConditionDto = new ConditionDto;

    const period = new Period();
    period.startTime = "00:00";
    period.endTime = "23:59";

    const day = new Day();
    day.periods = [period];

    const workingHour = new WorkingHour();
    workingHour.sun = day;
    workingHour.mon = day;
    workingHour.tue = day;
    workingHour.wed = day;
    workingHour.thu = day;
    workingHour.fri = day;
    workingHour.sat = day;

    conditions.startTime = this.utilService.checkAndAdjustDate(strStartDate, inputDateFormat, grabDateFormat, parseInt(process.env.ADJUST_TZ));
    conditions.endTime = this.utilService.convertDateFormat(strEndDate, inputDateFormat, grabDateFormat, parseInt(process.env.ADJUST_TZ));
    conditions.eaterType = 'all';
    if (entity.bundle_qty)
    conditions.bundleQuantity = entity.bundle_qty ? parseInt(entity.bundle_qty) : 0;
    conditions.workingHour = workingHour;

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
        bu: process.env.BU,
        status: 0
      },
      order: {
        promotion_mode: 'ASC',
        created_date: 'ASC',
      },
    });
  }
}

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
  //private debounceTimeout;
  constructor(
    @InjectRepository(PromotionGrabmartEntity) 
    private readonly promotionGrabmartRepository: Repository<PromotionGrabmartEntity>,
    @InjectRepository(MasterGrabmartEntity) 
    private readonly masterGrabmartRepository: Repository<MasterGrabmartEntity>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly utilService: UtilService,
  ) {
    /*
    this.debounceTimeout = null;

    setInterval(() => {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(this.checkCampaign.bind(this), 60000);
    }, 60000); 
    */
    this.checkCampaign();
    setInterval(this.checkCampaign.bind(this), parseInt(process.env.BATCH_PERIOD)); 
  }


  
  async getUpdateStatus() : Promise<number> {
    const updatestatus = new Date().getTime() - 1732000000000;
    const random = Math.floor(Math.random() * 1000);
    return (updatestatus * 1000) + random;
  }

  async groupPromotionsByMerchant(promotions : PromotionGrabmartEntity[]) : Promise<PromotionGrabmartEntity[][]> {
    const groupedPromotions: { [merchantID: string]: PromotionGrabmartEntity[] } = {};
  
    promotions.forEach(promotion => {
      const { merchant_id } = promotion;
  
      if (!groupedPromotions[merchant_id]) {
        groupedPromotions[merchant_id] = [];
      }
  
      groupedPromotions[merchant_id].push(promotion);
    });
  
    return Object.values(groupedPromotions);
  }

  async sleep(millis: number) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  async checkCampaign() {
    const updatestatus = await this.getUpdateStatus();
    const lastwait = updatestatus - (1000 * 60 * parseInt(process.env.BATCH_WAIT) * 1000);

    this.logger.debug(updatestatus + " - begin batch ");

    this.logger.debug(updatestatus + " - last wait is " + lastwait);

    //const sql = 'UPDATE top(@0) cfgsmp_promotion_grabmart SET status = @1 WHERE bu = @2 AND ((status > @3 AND status < @4) OR status = 0) AND merchant_id not in (SELECT merchant_id FROM cfgsmp_promotion_grabmart WHERE bu = @5 AND status >= @6)';
    //const sql = 'WITH OrderedRows AS (SELECT TOP (@0) * FROM cfgsmp_promotion_grabmart WHERE bu = @2 AND ((status > @3 AND status < @4) OR status = 0) AND merchant_id IN ( SELECT DISTINCT TOP(@7) merchant_id FROM cfgsmp_promotion_grabmart WHERE merchant_id NOT IN (SELECT merchant_id FROM cfgsmp_promotion_grabmart WHERE bu = @5 AND status >= @6)) ORDER BY updated_date ) UPDATE OrderedRows SET status = @1';
   /*
    const sql_count = 'WITH MerchantIds AS ( ' +
    'SELECT DISTINCT TOP (@7) merchant_id ' +
    'FROM cfgsmp_promotion_grabmart ' +
    'WHERE ((status > @3 and status < @4) or status = 0) AND merchant_id NOT IN ( ' +
    'SELECT merchant_id ' +
    'FROM cfgsmp_promotion_grabmart ' +
    "WHERE bu = @2 AND status >= @6 " +
    ') ' +
    '), ' +
    'OrderedRows AS ( ' +
    'SELECT *, ' +
    'ROW_NUMBER() OVER (PARTITION BY merchant_id ORDER BY updated_date) AS RowNum ' +
    'FROM cfgsmp_promotion_grabmart ' +
    'WHERE bu = @5 ' +
    'AND ((status > @3 AND status < @4) OR status = 0) ' +
    'AND merchant_id IN (SELECT merchant_id FROM MerchantIds) ' +
    '), ' +
    'FilteredRows AS ( ' +
    'SELECT * ' +
    'FROM OrderedRows ' +
    'WHERE RowNum <= @0 / @8 ' +
    ') ' +
    'SELECT COUNT(1) FROM FilteredRows ';

const countResult = await this.promotionGrabmartRepository.query(sql_count, [parseInt(process.env.BATCH_SIZE), updatestatus, process.env.BU, 1000, lastwait, process.env.BU, lastwait, parseInt(process.env.BATCH_SELLER_SIZE), parseInt(process.env.BATCH_SELLER_SIZE)]);

console.log(countResult);
*/

      const sql = 'WITH MerchantIds AS ( ' +
                  'SELECT DISTINCT TOP (@7) merchant_id ' +
                  'FROM cfgsmp_promotion_grabmart ' +
                  'WHERE bu = @2 AND ((status > @3 AND status < @4) or status = 0) ' + 
                  'AND ABS(CHECKSUM(merchant_id) % @9) = @10'
                  'AND merchant_id NOT IN ( ' +
                  'SELECT merchant_id ' +
                  'FROM cfgsmp_promotion_grabmart ' +
                  "WHERE bu = @2 AND status >= @6 " +
                  ') ' +
                  '), ' +
                  'OrderedRows AS ( ' +
                  'SELECT *, ' +
                  'ROW_NUMBER() OVER (PARTITION BY merchant_id ORDER BY updated_date) AS RowNum ' +
                  'FROM cfgsmp_promotion_grabmart ' +
                  'WHERE bu = @5 ' +
                  'AND ((status > @3 AND status < @4) OR status = 0) ' +
                  'AND merchant_id IN (SELECT merchant_id FROM MerchantIds) ' +
                  '), ' +
                  'FilteredRows AS ( ' +
                  'SELECT * ' +
                  'FROM OrderedRows ' +
                  'WHERE RowNum <= @0 / @8 ' +
                  ') ' +
              'UPDATE FilteredRows SET status = @1 ';

    let retry = true
    while (retry) {
      try {
        await this.promotionGrabmartRepository.query(sql, [parseInt(process.env.BATCH_SIZE), updatestatus, process.env.BU, 1000, lastwait, process.env.BU, lastwait, parseInt(process.env.BATCH_SELLER_SIZE), parseInt(process.env.BATCH_SELLER_SIZE), parseInt(process.env.MERCHANT_MOD), parseInt(process.env.MERCHANT_MOD_RES)]);

        retry = false;
      } catch (error) {
        this.logger.warn(updatestatus + ' - Found error, wait 1000 ms and retry : ' + error );
        await this.sleep(1000)
      }
    }
     
    const promotions = await this.promotionGrabmartRepository.find({
      where: { 
        bu: process.env.BU,
        status: updatestatus
      },
      order: {
        promotion_mode: 'ASC',
        created_date: 'ASC',
      },
    });   

    this.logger.log(updatestatus + " - Found promotion to process : " + promotions.length)

    const merchantPromotions = await this.groupPromotionsByMerchant(promotions);

    for (const merchantPromotion of merchantPromotions) {
      this.processCampaignByMerchant(merchantPromotion, updatestatus);
    }

    this.logger.debug(updatestatus + " - finish batch ");
  }

  async processCampaignByMerchant(promotions : PromotionGrabmartEntity[], updatestatus : number) {
    this.logger.log(updatestatus + " - Found remain promotion of merchant " + promotions[0]?.merchant_id + " to process : " + promotions.length)

    for (const promotion of promotions) {
      if (promotion.promotion_mode === 'DELETE') {
        await this.processCampaign(promotion, updatestatus);
      }
      else if (parse(promotion.end_date + " 23:59:59", "yyyy-MM-dd HH:mm:ss", new Date()).getTime() <= new Date().getTime()) {
        promotion.status = 103;
        promotion.updated_date = new Date();

        this.promotionGrabmartRepository.save(promotion);
        this.logger.warn(updatestatus + " - Failed to post campaign for merchant ID: " + promotion.merchant_id + ' of ID ' + promotion.id + ' because end date already pass.');
      }
      else if (!promotion.barcode) {
        this.logger.warn(updatestatus + ' - Promotion ' + promotion.promotion_no + ' of ID ' + promotion.id + ' no barcode');
        promotion.status = 102;
        promotion.updated_date = new Date();
  
        this.promotionGrabmartRepository.save(promotion);
      }
      else if (promotion.grab_promotion_type === 'net') {
        const master = await this.masterGrabmartRepository.findOne({
          where: {
            status: LessThan(0),
            barcode: promotion.barcode,
            seller_id: promotion.merchant_id,
          }
        });

        if (master) {
          if (master.sold_by_weight) {
            if (master.weight_unit === 'g') {
              promotion.campaign_value = Math.ceil((parseInt(promotion.campaign_value) * master.weigth_value)/1000).toString();
            }
            else {
              promotion.campaign_value = Math.ceil(parseInt(promotion.campaign_value) * master.weigth_value).toString();
            }
          }

          await this.processCampaign(promotion, updatestatus);
        }
        else {
          promotion.status = 0;
          promotion.updated_date = new Date();
    
          this.promotionGrabmartRepository.save(promotion);
    
          this.logger.debug(updatestatus + ' - Promotion ' + promotion.promotion_no + ' of ID ' + promotion.id + ' barcode ' + promotion.barcode + ' master not sync success ');
        }
      }
      else {
        const barcodes = promotion.barcode?.split(',');

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

        if (barcodes.length === syncFinishCount && barcodes.length > 0) {
          await this.processCampaign(promotion, updatestatus);
        }
        else {
          promotion.status = 0;
          promotion.updated_date = new Date();
    
          this.promotionGrabmartRepository.save(promotion);
    
          this.logger.debug(updatestatus + ' - Promotion ' + promotion.promotion_no + ' of ID ' + promotion.id + ' has ' +barcodes.length + ' barcode(s) but master sync success ' + syncFinishCount);
        }
      }
    }
    
    //get campaign
    //check masteer
    //process promotion
  }

  async readCampaign(merchantID: string) {
    const updatestatus = new Date().getTime();
    this.logger.debug(updatestatus + " - Trigger merchantID : " + merchantID);
    const promotions: PromotionGrabmartEntity[] = await this.getPromotionsByMerchantId(merchantID);
    for(const promotion of promotions) {
      this.processCampaign(promotion, updatestatus);
    }
  }

  async processCampaign(promotion: PromotionGrabmartEntity, updatestatus: number) {
    if(promotion.promotion_mode === "INSERT") {
      await this.createCampaign(promotion, promotion.merchant_id, updatestatus);
    } else {
      await this.deleteCampaign(promotion, promotion.merchant_id, updatestatus);
    }
}

  async createCampaign(promotion: PromotionGrabmartEntity, merchantID: string, updatestatus: number) {

    const url = process.env.ADAPTER_URL + "/campaign";
    const grabCampaign: GrabCampaignDto = await this.setGrabCampaign(promotion);

    this.logger.debug(updatestatus + " - Create campaign : " + JSON.stringify(grabCampaign));
    try {
      // Send POST request with grabCampaign as the body
      const response = await lastValueFrom(
        this.httpService.post<GrabCampaignResposneDto>(url, grabCampaign)
      );

      if (response.status === 200) {
        if (response.data.status === 0) {
          promotion.campaign_id = response.data.campaignID;
          promotion.status = 99;
          promotion.updated_date = new Date();
  
          this.promotionGrabmartRepository.save(promotion);
  
          this.logger.debug(updatestatus + " - Successfully posted campaign for merchant ID: " + merchantID  + ' of ID ' + promotion.id+ " get campaign id: " + promotion.campaign_id);
        }
        else {
          promotion.status = 0;
          promotion.updated_date = new Date();
  
          this.promotionGrabmartRepository.save(promotion);

          this.logger.error(updatestatus + " - Failed to posted campaign for merchant ID: " + merchantID  + ' of ID ' + promotion.id+ " error message " + response.data.message);
        }
      }
      else {
        promotion.status = 0;
        promotion.updated_date = new Date();

        this.promotionGrabmartRepository.save(promotion);

        this.logger.error(updatestatus + " - Failed to post campaign for merchant ID: " + merchantID + ' of ID ' + promotion.id + " response code: " + response.status);
        //throw new HttpException('Failed to delete resource', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      promotion.status = 0;
      promotion.updated_date = new Date();

      this.promotionGrabmartRepository.save(promotion);

      this.logger.error(updatestatus + " - Failed to post campaign for merchant ID: " + merchantID + ' of ID ' + promotion.id + " Error : " + error);
    }  
  }

  async deleteCampaign(promotion: PromotionGrabmartEntity, merchantID: string, updatestatus: number) {
    this.logger.debug(updatestatus + " - Delete merchantID : " + merchantID + " campaign id:" + promotion.campaign_id);
    const url = process.env.ADAPTER_URL + "/campaign/"+promotion.campaign_id;
    
    try {
      const response = await lastValueFrom(this.httpService.delete(url));
      if (response.status !== 200) {
        promotion.status = 0;
        promotion.updated_date = new Date();
  
        this.promotionGrabmartRepository.save(promotion);
  
        throw new HttpException('Failed to delete resource', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      else {
        promotion.status = 99;
        promotion.updated_date = new Date();
  
        this.promotionGrabmartRepository.save(promotion);

        this.logger.debug(updatestatus + " - Successfully delete campaign for merchant ID: " + merchantID  + ' of ID ' + promotion.id+ " get campaign id: " + promotion.campaign_id);
      }
    } catch (error) {
      promotion.status = 0;
      promotion.updated_date = new Date();

      this.promotionGrabmartRepository.save(promotion);

      this.logger.error(updatestatus + " - Failed to delete campaign for campaign ID: " + promotion.campaign_id + " Error : " + error);
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
      conditions.bundleQuantity = parseInt(entity.bundle_qty);
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
    scope.objectIDs = entity.barcode?.split(',');

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

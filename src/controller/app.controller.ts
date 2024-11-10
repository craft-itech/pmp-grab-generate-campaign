import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AttributeResponse } from 'src/type/attributeResp';
import { AppService } from '../service/app.service';
import { InPutKafka } from 'src/dtos/inputkafka';
import { GenerateCampaignService } from 'src/service/generate-campaign.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly genCampaignService: GenerateCampaignService
              ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('adapter/topsonline/product/attribute')
  getAttribute(
    @Query('categoryID') categoryID?: string,
    @Query('lang') lang?: string,
  ):
   Promise<AttributeResponse> {
    return this.genCampaignService.getAttribute(categoryID, lang);
  }

  @Get('adapter/topsonline/health')
  getHealth(): string {
    return 'Test Success';
  }

  @Post('adapter/topsonline/product')
  createProduct(@Body() inPutKafka: InPutKafka){
    return this.genCampaignService.crateProduct(inPutKafka);
  }

  @Post('adapter/topsonline/price')
  createPrice(@Body() inPutKafka: InPutKafka){
    return this.genCampaignService.cratePrice(inPutKafka);
  }
}

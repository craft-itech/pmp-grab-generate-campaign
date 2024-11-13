import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GenerateCampaignService } from 'src/service/generate-campaign.service';

@Controller()
export class AppController {
  constructor(
              private readonly genCampaignService: GenerateCampaignService
              ) {}

  @Get('health')
  getHealth(): string {
    return 'Success';
  }

  @Post('trigger/:seller')
  createProduct(@Param('seller') merchantId){
    try {
      return this.genCampaignService.readCampaign(merchantId);
    }
    catch (error) {
      return error;
    }
  }
}

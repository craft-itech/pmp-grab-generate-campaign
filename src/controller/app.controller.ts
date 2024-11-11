import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Post('trigger')
  createProduct(@Body() merchantId: string){
    return this.genCampaignService.readCampaign(JSON.stringify(merchantId));
  }
}

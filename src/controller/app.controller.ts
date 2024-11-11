import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { GenerateCampaignService } from 'src/service/generate-campaign.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly genCampaignService: GenerateCampaignService
              ) {}

  @Get('health')
  getHealth(): string {
    return 'Test Success';
  }

  @Post('trigger')
  createProduct(@Body() merchantId: string){
    return this.genCampaignService.readCampaign(merchantId);
  }
}

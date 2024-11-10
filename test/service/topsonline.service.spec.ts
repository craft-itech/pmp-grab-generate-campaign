import { GenerateCampaignService } from '../../src/service/generate-campaign.service';

describe('TopsOnlineServive', () => {
  let topsOnlineService: GenerateCampaignService;

  beforeEach(() => {
    topsOnlineService = new GenerateCampaignService({} as any, {} as any, {} as any);

    topsOnlineService.createimgOutput = {
      channel: 'TOL',
      image: {
        product_images: [],
        infographics: [],
        last_update_date: '',
      },
    };
  });

  describe('Test clubImg function', () => {
    test('clubImg function should push img to product_images', async () => {
      const val = {
        image1: 'http://example.com/image1.jpg',
        image2: 'image2.jpg',
      };

      await topsOnlineService.clubimg(val);

      expect(topsOnlineService.createimgOutput.image.product_images).toEqual([
        '/image1.jpg',
        'image2.jpg',
      ]);
    });
  });

  describe('Test clubInfographic function', () => {
    test('clubInfographic should push infographic', async () => {
      const val = {
        infographic1: 'http://example.com/infographic1.png',
        infographic2: 'infographic2.png',
      };

      await topsOnlineService.clubInfographic(val);

      expect(topsOnlineService.createimgOutput.image.infographics).toEqual([
        '/infographic1.png',
        'infographic2.png',
      ]);
    });
  });
});

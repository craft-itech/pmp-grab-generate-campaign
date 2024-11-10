import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  
  static getStringToBoolean(channelsDefault: string): boolean {
    if(channelsDefault == 'true'){
      return true;
    }
    if(channelsDefault == 'false'){
      return false;
    }
  }
}

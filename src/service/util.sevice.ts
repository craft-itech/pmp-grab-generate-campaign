import { Injectable } from '@nestjs/common';
import { format, parse } from 'date-fns';

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

  /**
   * Converts a date string from a given input format to an output format.
   * @param dateStr - The date string to convert.
   * @param inputFormat - The format of the input date string.
   * @param outputFormat - The desired format of the output date string.
   * @returns The formatted date string.
   */
  convertDateFormat(dateStr: string, inputFormat: string, outputFormat: string): string {
    const parsedDate = parse(dateStr, inputFormat, new Date());
    return format(parsedDate, outputFormat);
  }
}

import { Injectable } from '@nestjs/common';
import { format, parse, isBefore, addHours, addMinutes } from 'date-fns';

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

  checkAndAdjustDate(
    dateStr: string,
    inputFormat: string,
    outputFormat: string
  ): string {
    // Parse the input date
    const parsedInputDate = parse(dateStr, inputFormat, new Date());
    const currentDate = new Date();

    // Check if input date is before the current date
    if (isBefore(parsedInputDate, currentDate)) {
      // Add 1 hour and 5 minutes to current date if input date is in the past
      const adjustedDate = addMinutes(addHours(currentDate, 1), 5);

      console.log("adjust date");
      console.log(adjustedDate);

      return format(adjustedDate, outputFormat);
    }

  
    console.log("parse date");
    console.log(parsedInputDate);
// If input date is not before current date, return it as is in the desired format
    return format(parsedInputDate, outputFormat);
  }
}

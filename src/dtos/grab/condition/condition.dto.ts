import { WorkingHour } from "./workinghour.dto"


export class ConditionDto{
    startTime: string
    endTime: string
    eaterType: string
    minBasketAmount: number
    workingHour: WorkingHour
    bundleQuantity: number
}
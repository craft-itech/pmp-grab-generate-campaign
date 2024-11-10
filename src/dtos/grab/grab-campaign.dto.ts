import { ConditionDto } from "./condition/condition.dto"
import { DiscountDto } from "./discount/discount.dto"
import { QuotaDto } from "./quota/quota.dto"

export class GrabCampaignDto{
    id: string
    createdBy: string
    merchantID: string
    name: string
    quotas: QuotaDto
    conditions: ConditionDto
    discount: DiscountDto
    customTag: string
}
import { Condition } from "./condition/condition.dto"
import { DiscountDto } from "./discount/discount.dto"
import { QuotaDto } from "./quota/quota.dto"

export class GrabCampaignDto{
    id: string
    createdBy: string
    merchantID: string
    name: string
    quotas: QuotaDto
    conditions: Condition
    discount: DiscountDto
    customTag: string
}
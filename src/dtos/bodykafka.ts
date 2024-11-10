import { ProductKafka } from "./productkafka"

export class BodyKafka{
    shop_id: number
    categoryId: string
    products: ProductKafka[]
}
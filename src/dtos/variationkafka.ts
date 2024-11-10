import { AttributeKafka } from "./attributekafka";

export class VariationKafka{
    id: number;
    barcode: string;
    stock: string;
    price: string;
    height: string;
    width: string;
    length: string;
    weight: string;
    on_shelf: string;
    images: string[];
    infographics : string[];
    attributes: AttributeKafka[];
}
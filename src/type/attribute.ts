import { Option } from './option';

export class Attribute {
    attributeID: string;
    attributeName: string;
    attributeType: string;
    attributeDataType: string;
    attributeRequire: boolean;
    attributeDefaultValue: string;
    attributeMaxLength: number;
    attributeVariantKey: boolean;
    attributeOptions: Option[];


    constructor(attributeID, attributeName, attributeDataType, attributeType, attributeRequire, attributeVariantKey, attributeOptions) {
        this.attributeID = attributeID;
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeDataType = attributeDataType;
        this.attributeRequire = attributeRequire;
        this.attributeVariantKey = attributeVariantKey;
        this.attributeOptions = attributeOptions;
    }
}
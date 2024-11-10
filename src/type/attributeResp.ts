import { Attribute } from './attribute';

export class AttributeResponse {
    statusCode: string;
    statusMessage: string;
    data: Attribute[];

    constructor(statusCode, statusMessage, data) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.data = data;
    }
}
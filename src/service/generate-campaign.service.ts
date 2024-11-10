import { Injectable } from '@nestjs/common';
import { AttributeResponse } from '../type/attributeResp';
import { Attribute } from '../type/attribute';
import { Option } from '../type/option';
import { InPutKafka } from '../dtos/inputkafka';
import { InPutKafkaAny } from '../dtos/inptukafkaany';
import { SqsPublisherService } from './sqs.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { kafkaConfig } from '../module/kafka.config';
import {
  InjectLogger,
  NestjsWinstonLoggerService,
} from 'nestjs-winston-logger';
import { Client, ClientKafka } from '@nestjs/microservices';

@Injectable()
export class GenerateCampaignService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly sqsService: SqsPublisherService,
    @InjectLogger(GenerateCampaignService.name)
    private logger: NestjsWinstonLoggerService,
  ) {}

	@Client(kafkaConfig)
	    clientKafka: ClientKafka;

      addVal: string;
  createOutput: any;
  createimgOutput: any;

  async getAttribute(
    _categoryID?: string,
    _lang?: string,
  ): Promise<AttributeResponse> {
    // this.logger.debug('Get Attribute');
    let ynLov = [];
    ynLov.push(new Option('Y', 'Yes'));
    ynLov.push(new Option('N', 'No'));

    let attributes = [];
    attributes.push(
      new Attribute(
        'ONLINE001',
        'Aggregated Product barcode Identifier',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE002',
        'Product Name EN',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE003',
        'Product Name TH',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE004',
        'Standard UOM',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE005',
        'Package UOM',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE006',
        'Package Size',
        'NUMBER',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE007',
        'Consumer Unit TH',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE008',
        'Consumer Unit EN',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE009',
        'Brand Code',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE010',
        'Brand Name TH',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE011',
        'Brand Name EN',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE012',
        'group_no',
        'NUMBER',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE013',
        'division',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE014',
        'Product Department code',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE015',
        'Product Department description in EN',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE016',
        'Product Department description in TH',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE017',
        'Product Class code',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE018',
        'Product Class description in EN',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE019',
        'Product Class description in TH',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE020',
        'Product subclass code',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE021',
        'Product Subclass description in EN',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE022',
        'Product Subclass description in TH',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE023',
        'Created Date',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE024',
        'Last update',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE025',
        'Exclusive Flag',
        'DROPDOWN',
        'normal',
        false,
        null,
        ynLov,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE026',
        'Exclusivity from date',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE027',
        'Exclusivity to date',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE028',
        'pack_ind',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE029',
        'simple_pack_ind',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE030',
        'Item Pack No',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE031',
        'Item Pack QTY',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE032',
        'UOM Description',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE033',
        'weight_item_ind',
        'DROPDOWN',
        'normal',
        false,
        null,
        ynLov,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE034',
        'Shipping weight',
        'NUMBER',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE035',
        'avg_weightperunit',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE036',
        'catch_weight_ind',
        'DROPDOWN',
        'normal',
        false,
        null,
        ynLov,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE037',
        'uda3_local_import',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE038',
        'uda5_country',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE039',
        'uda8_item_type_indicator',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE040',
        'uda8_credit_consign_desc',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE041',
        'uda26_alcohol_code',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE042',
        'uda27_alcohol_degree',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE043',
        'item_number_type',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE044',
        'uda29_safety_control_type',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE045',
        'uda30_safety_control',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE046',
        'uda2_special_purpose',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE047',
        'uda9_ingredient_item',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE048',
        'uda11_long_name_thai',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE049',
        'uda12_long_name_eng',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE050',
        'uda13_short_name_thai',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE051',
        'uda14_short_name_eng',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE052',
        'uda56_product_knowledge',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE056',
        'uda22_store_stock_day',
        'NUMBER',
        'normal',
        true,
        null,
        null,
      ),
    ); //ch
    attributes.push(
      new Attribute(
        'ONLINE057',
        'uda23_expiry_date_day',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    ); //ch
    attributes.push(
      new Attribute(
        'ONLINE058',
        'Vat Code',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    ); //ch
    attributes.push(
      new Attribute(
        'ONLINE059',
        'Standard supplier cost (excl. VAT)',
        'NUMBER',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE060',
        'Item location status',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute('ONLINE061', 'Flavor', 'TEXT', 'normal', false, null, null),
    );
    attributes.push(
      new Attribute('ONLINE062', 'scent', 'TEXT', 'normal', false, null, null),
    );
    attributes.push(
      new Attribute('ONLINE063', 'Size', 'TEXT', 'normal', false, null, null),
    );
    attributes.push(
      new Attribute('ONLINE064', 'Color', 'TEXT', 'normal', false, null, null),
    );
    attributes.push(
      new Attribute(
        'ONLINE065',
        'Product Variation Name Level 1',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE066',
        'Variant value Level 1',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE067',
        'Product Variation Name Level 2',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE068',
        'Variant value Level 2',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE069',
        'Product Classification',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE071',
        'New arrival flag',
        'DROPDOWN',
        'normal',
        false,
        null,
        ynLov,
      ),
    );

    attributes.push(
      new Attribute(
        'ONLINE133',
        'Product Status',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE134',
        'Create Date',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE135',
        'Last update',
        'TEXT',
        'normal',
        true,
        null,
        null,
      ),
    );

    attributes.push(
      new Attribute(
        'ONLINE136',
        'New Arrival From Date',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE137',
        'New Arrival To Date',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );

    attributes.push(
      new Attribute(
        'ONLINE138',
        'Tops Online Description (TH)',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );
    attributes.push(
      new Attribute(
        'ONLINE139',
        'Tops Online Description (EN)',
        'TEXT',
        'normal',
        false,
        null,
        null,
      ),
    );

    return Promise.resolve(new AttributeResponse('200', 'success', attributes));
  }

  async ONLINE001(key: string, value: string) {
    if (key == 'ONLINE001') {
      this.addVal = value;
      this.createOutput.product.aggregated_product = this.addVal;
    }
  }
  async ONLINE002(key: string, value: string) {
    if (key == 'ONLINE002') {
      this.addVal = value;
      this.createOutput.product.ad_name_eng = this.addVal;
    }
  }
  async ONLINE003(key: string, value: string) {
    if (key == 'ONLINE003') {
      this.addVal = value;
      this.createOutput.product.ad_name_thai = this.addVal;
    }
  }
  async ONLINE004(key: string, value: string) {
    if (key == 'ONLINE004') {
      this.addVal = value;
      this.createOutput.product.standard_uom = this.addVal;
    }
  }
  async ONLINE005(key: string, value: string) {
    if (key == 'ONLINE005') {
      this.addVal = value;
      this.createOutput.product.package_uom = this.addVal;
    }
  }
  async ONLINE006(key: string, value: string) {
    if (key == 'ONLINE006') {
      this.addVal = value;
      this.createOutput.product.package_size = this.addVal;
    }
  }
  async ONLINE007(key: string, value: string) {
    if (key == 'ONLINE007') {
      this.addVal = value;
      this.createOutput.product.consumer_unit = this.addVal;
    }
  }
  async ONLINE008(key: string, value: string) {
    if (key == 'ONLINE008') {
      this.addVal = value;
      this.createOutput.product.consumer_unit_eng = this.addVal;
    }
  }
  async ONLINE009(key: string, value: string) {
    if (key == 'ONLINE009') {
      this.addVal = value;
      this.createOutput.product.brand_code = this.addVal;
    }
  }
  async ONLINE010(key: string, value: string) {
    if (key == 'ONLINE010') {
      this.addVal = value;
      this.createOutput.product.brand_name_thai = this.addVal;
    }
  }
  async ONLINE011(key: string, value: string) {
    if (key == 'ONLINE011') {
      this.addVal = value;
      this.createOutput.product.brand_name_eng = this.addVal;
    }
  }
  async ONLINE012(key: string, value: string) {
    if (key == 'ONLINE012') {
      this.addVal = value;
      this.createOutput.product.group_no = this.addVal;
    }
  }
  async ONLINE013(key: string, value: string) {
    if (key == 'ONLINE013') {
      this.addVal = value;
      this.createOutput.product.division = this.addVal;
    }
  }
  async ONLINE014(key: string, value: string) {
    if (key == 'ONLINE014') {
      this.addVal = value;
      this.createOutput.product.dept = this.addVal;
    }
  }
  async ONLINE015(key: string, value: string) {
    if (key == 'ONLINE015') {
      this.addVal = value;
      this.createOutput.product.dept_name = this.addVal;
    }
  }
  async ONLINE016(key: string, value: string) {
    if (key == 'ONLINE016') {
      this.addVal = value;
      this.createOutput.product.t_dept_name = this.addVal;
    }
  }
  async ONLINE017(key: string, value: string) {
    if (key == 'ONLINE017') {
      this.addVal = value;
      this.createOutput.product.class_no = this.addVal;
    }
  }
  async ONLINE018(key: string, value: string) {
    if (key == 'ONLINE018') {
      this.addVal = value;
      this.createOutput.product.class_name = this.addVal;
    }
  }
  async ONLINE019(key: string, value: string) {
    if (key == 'ONLINE019') {
      this.addVal = value;
      this.createOutput.product.t_class_name = this.addVal;
    }
  }
  async ONLINE020(key: string, value: string) {
    if (key == 'ONLINE020') {
      this.addVal = value;
      this.createOutput.product.subclass = this.addVal;
    }
  }
  async ONLINE021(key: string, value: string) {
    if (key == 'ONLINE021') {
      this.addVal = value;
      this.createOutput.product.subclass_name = this.addVal;
    }
  }
  async ONLINE022(key: string, value: string) {
    if (key == 'ONLINE022') {
      this.addVal = value;
      this.createOutput.product.t_sub_name = this.addVal;
    }
  }
  async ONLINE025(key: string, value: string) {
    if (key == 'ONLINE025') {
      this.addVal = value;
      this.createOutput.product.exclusive_flag = this.addVal;
    }
  }
  async ONLINE026(key: string, value: string) {
    if (key == 'ONLINE026') {
      this.addVal = value;
      this.createOutput.product.exclusivity_from = this.addVal;
    }
  }
  async ONLINE027(key: string, value: string) {
    if (key == 'ONLINE027') {
      this.addVal = value;
      this.createOutput.product.exclusivity_to = this.addVal;
    }
  }
  async ONLINE028(key: string, value: string) {
    if (key == 'ONLINE028') {
      this.addVal = value;
      this.createOutput.product.pack_ind =
        this.addVal === 'true'
          ? 'Y'
          : this.addVal === 'false'
          ? 'N'
          : this.addVal;
    }
  }
  async ONLINE029(key: string, value: string) {
    if (key == 'ONLINE029') {
      this.addVal = value;
      this.createOutput.product.simple_pack_ind =
        this.addVal === 'true'
          ? 'Y'
          : this.addVal === 'false'
          ? 'N'
          : this.addVal;
    }
  }
  async ONLINE030(key: string, value: string) {
    if (key == 'ONLINE030') {
      this.addVal = value;
      this.createOutput.product.item_pack_no = this.addVal;
    }
  }
  async ONLINE031(key: string, value: string) {
    if (key == 'ONLINE031') {
      this.addVal = value;
      this.createOutput.product.item_pack_qty = this.addVal;
    }
  }
  async ONLINE032(key: string, value: string) {
    if (key == 'ONLINE032') {
      this.addVal = value;
      this.createOutput.product.uom_desc = this.addVal;
    }
  }
  async ONLINE033(key: string, value: string) {
    if (key == 'ONLINE033') {
      this.addVal = value;
      this.createOutput.product.weight_item_ind = this.addVal;
    }
  }
  async ONLINE034(key: string, value: string) {
    if (key == 'ONLINE034') {
      this.addVal = value;
      this.createOutput.product.shipping_weight = this.addVal;
    }
  }
  async ONLINE035(key: string, value: string) {
    if (key == 'ONLINE035') {
      this.addVal = value;
      this.createOutput.product.avg_weightperunit = this.addVal;
    }
  }
  async ONLINE036(key: string, value: string) {
    if (key == 'ONLINE036') {
      this.addVal = value;
      this.createOutput.product.catch_weight_ind = this.addVal;
    }
  }
  async ONLINE037(key: string, value: string) {
    if (key == 'ONLINE037') {
      this.addVal = value;
      this.createOutput.product.uda3_local_import = this.addVal;
    }
  }
  async ONLINE038(key: string, value: string) {
    if (key == 'ONLINE038') {
      this.addVal = value;
      this.createOutput.product.uda5_country = this.addVal;
    }
  }
  async ONLINE039(key: string, value: string) {
    if (key == 'ONLINE039') {
      this.addVal = value;
      this.createOutput.product.uda8_item_type_indicator = this.addVal;
    }
  }
  async ONLINE040(key: string, value: string) {
    if (key == 'ONLINE040') {
      this.addVal = value;
      this.createOutput.product.uda8_credit_consign_desc = this.addVal;
    }
  }
  async ONLINE041(key: string, value: string) {
    if (key == 'ONLINE041') {
      this.addVal = value;
      this.createOutput.product.uda26_alcohol_code = this.addVal;
    }
  }
  async ONLINE042(key: string, value: string) {
    if (key == 'ONLINE042') {
      this.addVal = value;
      this.createOutput.product.uda27_alcohol_degree = this.addVal;
    }
  }
  async ONLINE043(key: string, value: string) {
    if (key == 'ONLINE043') {
      this.addVal = value;
      this.createOutput.product.item_number_type = this.addVal;
    }
  }
  async ONLINE044(key: string, value: string) {
    if (key == 'ONLINE044') {
      this.addVal = value;
      this.createOutput.product.uda29_safety_control_type = this.addVal;
    }
  }
  async ONLINE045(key: string, value: string) {
    if (key == 'ONLINE045') {
      this.addVal = value;
      this.createOutput.product.uda30_safety_control = this.addVal;
    }
  }
  async ONLINE046(key: string, value: string) {
    if (key == 'ONLINE046') {
      this.addVal = value;
      this.createOutput.product.uda2_special_purpose = this.addVal;
    }
  }
  async ONLINE047(key: string, value: string) {
    if (key == 'ONLINE047') {
      this.addVal = value;
      this.createOutput.product.uda9_ingredient_item = this.addVal;
    }
  }
  async ONLINE048(key: string, value: string) {
    if (key == 'ONLINE048') {
      this.addVal = value;
      this.createOutput.product.uda11_long_name_thai = this.addVal;
    }
  }
  async ONLINE049(key: string, value: string) {
    if (key == 'ONLINE049') {
      this.addVal = value;
      this.createOutput.product.uda12_long_name_eng = this.addVal;
    }
  }
  async ONLINE050(key: string, value: string) {
    if (key == 'ONLINE050') {
      this.addVal = value;
      this.createOutput.product.uda13_short_name_thai = this.addVal;
    }
  }
  async ONLINE051(key: string, value: string) {
    if (key == 'ONLINE051') {
      this.addVal = value;
      this.createOutput.product.uda14_short_name_eng = this.addVal;
    }
  }
  async ONLINE052(key: string, value: string) {
    if (key == 'ONLINE052') {
      this.addVal = value;
      this.createOutput.product.uda56_product_knowledge = this.addVal;
    }
  }
  async ONLINE053(key: string, value: string) {
    if (key == 'ONLINE053') {
      this.addVal = value;
      this.createOutput.product.height_dimension = this.addVal;
    }
  }
  async ONLINE054(key: string, value: string) {
    if (key == 'ONLINE054') {
      this.addVal = value;
      this.createOutput.product.width_dimension = this.addVal;
    }
  }
  async ONLINE055(key: string, value: string) {
    if (key == 'ONLINE055') {
      this.addVal = value;
      this.createOutput.product.depth_dimension = this.addVal;
    }
  }
  async ONLINE056(key: string, value: string) {
    if (key == 'ONLINE056') {
      this.addVal = value;
      this.createOutput.product.uda22_store_stock_day = this.addVal;
    }
  }
  async ONLINE057(key: string, value: string) {
    if (key == 'ONLINE057') {
      this.addVal = value;
      this.createOutput.product.uda23_expiry_date_day = this.addVal;
    }
  }
  async ONLINE058(key: string, value: string) {
    if (key == 'ONLINE058') {
      this.addVal = value;
      this.createOutput.product.vat_code = this.addVal;
    }
  }
  async ONLINE061(key: string, value: string) {
    if (key == 'ONLINE061') {
      this.addVal = value;
      this.createOutput.product.flavor = this.addVal;
    }
  }
  async ONLINE062(key: string, value: string) {
    if (key == 'ONLINE062') {
      this.addVal = value;
      this.createOutput.product.scent = this.addVal;
    }
  }
  async ONLINE063(key: string, value: string) {
    if (key == 'ONLINE063') {
      this.addVal = value;
      this.createOutput.product.size = this.addVal;
    }
  }
  async ONLINE064(key: string, value: string) {
    if (key == 'ONLINE064') {
      this.addVal = value;
      this.createOutput.product.color = this.addVal;
    }
  }
  async ONLINE065(key: string, value: string) {
    if (key == 'ONLINE065') {
      this.addVal = value;
      this.createOutput.product['product_variation_1_name'] = this.addVal;
    }
  }
  async ONLINE066(key: string, value: string) {
    if (key == 'ONLINE066') {
      this.addVal = value;
      this.createOutput.product['product_variation_1_value'] = this.addVal;
    }
  }
  async ONLINE067(key: string, value: string) {
    if (key == 'ONLINE067') {
      this.addVal = value;
      this.createOutput.product['product_variation_2_name'] = this.addVal;
    }
  }
  async ONLINE068(key: string, value: string) {
    if (key == 'ONLINE068') {
      this.addVal = value;
      this.createOutput.product['product_variation_2_value'] = this.addVal;
    }
  }
  async ONLINE069(key: string, value: string) {
    if (key == 'ONLINE069') {
      this.addVal = value;
      this.createOutput.product.product_classification = this.addVal;
    }
  }
  async ONLINE071(key: string, value: string) {
    if (key == 'ONLINE071') {
      this.addVal = value;
      this.createOutput.product.new_arrival_flag = this.addVal;
    }
  }
  async ONLINE133(key: string, value: string) {
    if (key == 'ONLINE133') {
      if (value == 'Active') {
        this.addVal = 'A';
      } else {
        this.addVal = 'I';
      }
      this.createOutput.product.product_status = this.addVal;
    }
  }
  async ONLINE134(key: string, value: string) {
    if (key == 'ONLINE134') {
      this.addVal = value;
      this.createOutput.product.created_date =
        this.addVal.substring(0, 10) + ' ' + this.addVal.substring(11, 19);
    }
  }
  async ONLINE135(key: string, value: string) {
    if (key == 'ONLINE135') {
      this.addVal = value;
      this.createOutput.product.lastupdatedate =
        this.addVal.substring(0, 10) + ' ' + this.addVal.substring(11, 19);
      this.createimgOutput.image.last_update_date =
        this.addVal.substring(0, 10) + ' ' + this.addVal.substring(11, 19);
    }
  }
  async ONLINE136(key: string, value: string) {
    if (key == 'ONLINE136') {
      this.addVal = value;
      this.createOutput.product.new_arrival_from = this.addVal;
    }
  }
  async ONLINE137(key: string, value: string) {
    if (key == 'ONLINE137') {
      this.addVal = value;
      this.createOutput.product.new_arrival_to = this.addVal;
    }
  }
  async ONLINE138(key: string, value: string) {
    if (key == 'ONLINE138') {
      this.addVal = value;
      this.createOutput.product.product_description_th = this.addVal;
    }
  }
  async ONLINE139(key: string, value: string) {
    if (key == 'ONLINE139') {
      this.addVal = value;
      this.createOutput.product.product_description_en = this.addVal;
    }
  }
  async lastUpdateDate() {
    var dt = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }),
    );
    this.addVal =
      dt.getFullYear().toString().padStart(4, '0') +
      '-' +
      (dt.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      dt.getDate().toString().padStart(2, '0') +
      ' ' +
      dt.getHours().toString().padStart(2, '0') +
      ':' +
      dt.getMinutes().toString().padStart(2, '0') +
      ':' +
      dt.getSeconds().toString().padStart(2, '0');

    this.createOutput.product.lastupdatedate = this.addVal;
    this.createimgOutput.image.last_update_date = this.addVal;
  }
  async clubimg(val: object) {
    if (val) {
      for (var i in val) {
        if (val[i] && val[i].toString().toUpperCase().startsWith('HTTP')) {
          this.createimgOutput.image.product_images.push(
            new URL(val[i].toString()).pathname,
          );
        } else {
          this.createimgOutput.image.product_images.push(val[i]);
        }
      }
    }
  }
  async clubInfographic(val: object) {
    if (val) {
      for (var i in val) {
        if (val[i] && val[i].toString().toUpperCase().startsWith('HTTP')) {
          this.createimgOutput.image.infographics.push(
            new URL(val[i].toString()).pathname,
          );
        } else {
          this.createimgOutput.image.infographics.push(val[i]);
        }
      }
    }
  }
  async clubbarcode(value: string) {
    if (value) {
      this.addVal = value;
      this.createOutput.product.barcode_ean13 = this.addVal;
      this.createimgOutput.image.barcode = this.addVal;
    }
  }

  async crateLocStatus(inPutKafka: InPutKafkaAny) {
    await this.sqsService.publish(process.env.loc_queue, inPutKafka);

    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_loc_queue + " with message [" + JSON.stringify(inPutKafka) + "].");
    this.clientKafka.emit(process.env.kafka_loc_queue, JSON.stringify(inPutKafka));
    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_loc_queue + " successfully.");

    await this.amqpConnection.publish(
      process.env.exchangesNameLoc,
      process.env.exchangeRouteLoc,
      inPutKafka,
    );
  }

  async cratePrice(inPutKafka: InPutKafkaAny) {
    await this.sqsService.publish(process.env.price_queue, inPutKafka);

    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_price_queue + " with message [" + JSON.stringify(inPutKafka) + "].");
    this.clientKafka.emit(process.env.kafka_price_queue, JSON.stringify(inPutKafka));
    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_price_queue + " successfully.");

    await this.amqpConnection.publish(
      process.env.exchangesNamePrice,
      process.env.exchangeRoutePrice,
      inPutKafka,
    );
  }

  async cratePromotion(inPutKafka: InPutKafkaAny) {
    await this.sqsService.publish(process.env.promotion_queue, inPutKafka);

    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_promotion_queue + " with message [" + JSON.stringify(inPutKafka) + "].");
    this.clientKafka.emit(process.env.kafka_promotion_queue, JSON.stringify(inPutKafka));
    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_promotion_queue + " successfully.");

    await this.amqpConnection.publish(
      process.env.exchangesNamePromotion,
      process.env.exchangeRoutePromotion,
      inPutKafka,
    );
  }

  async crateCancelPromotion(inPutKafka: InPutKafkaAny) {
    await this.sqsService.publish(
      process.env.cancel_promotion_queue,
      inPutKafka,
    );

    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_cancel_promotion_queue + " with message [" + JSON.stringify(inPutKafka) + "].");
    this.clientKafka.emit(process.env.kafka_cancel_promotion_queue, JSON.stringify(inPutKafka));
    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_cancel_promotion_queue + " successfully.");

    await this.amqpConnection.publish(
      process.env.exchangesNameCancelPromotion,
      process.env.exchangeRouteCancelPromotion,
      inPutKafka,
    );
  }

  async crateCoupon(inPutKafka: InPutKafkaAny) {
    await this.sqsService.publish(process.env.coupon_queue, inPutKafka);

    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_coupon_queue + " with message [" + JSON.stringify(inPutKafka) + "].");
    this.clientKafka.emit(process.env.kafka_coupon_queue, JSON.stringify(inPutKafka));
    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_coupon_queue + " successfully.");

    await this.amqpConnection.publish(
      process.env.exchangesNameCoupon,
      process.env.exchangeRouteCoupon,
      inPutKafka,
    );
  }
  async crateCampaign(inPutKafka: InPutKafkaAny) {
    await this.sqsService.publish(process.env.campaign_queue, inPutKafka);

    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_canpaign_queue + " with message [" + JSON.stringify(inPutKafka) + "].");
    this.clientKafka.emit(process.env.kafka_canpaign_queue, JSON.stringify(inPutKafka));
    this.logger.debug("Submit message to kafka queue : " + process.env.kafka_canpaign_queue + " successfully.");

    await this.amqpConnection.publish(
      process.env.exchangesNameCampaign,
      process.env.exchangeRouteCampaign,
      inPutKafka,
    );
  }

  async crateProduct(inPutKafka: InPutKafka) {
    for (let ShowProducts of inPutKafka.body.products) {
      for (let ShowVariations of ShowProducts.variations) {
        this.createOutput = {
          channel: 'TOL',
          product: {
            aggregated_product: '', //
            ad_name_thai: '', //
            ad_name_eng: '', //
            product_status: '', //
            standard_uom: '', //
            package_uom: '', //
            package_size: '', //
            consumer_unit: '', //
            consumer_unit_eng: '', //
            brand_code: '', //
            brand_name_thai: '', //
            brand_name_eng: '', //
            group_no: '', //
            division: '', //
            dept: '', //
            dept_name: '', //
            t_dept_name: '', //
            class_no: '', //
            class_name: '', //
            t_class_name: '', //
            subclass: '', //
            subclass_name: '', //
            t_sub_name: '', //
            lastupdatedate: '', // fix form last_update_date
            exclusive_flag: '', //
            exclusivity_from: '', //
            exclusivity_to: '', //
            pack_ind: '', //
            simple_pack_ind: '', //
            item_pack_no: '', //
            item_pack_qty: '', //
            uom_desc: '', //
            weight_item_ind: '',
            shipping_weight: '', //
            avg_weightperunit: '', //
            catch_weight_ind: '', //
            uda3_local_import: '', //
            uda5_country: '', //
            uda8_item_type_indicator: '', //
            uda8_credit_consign_desc: '', //
            uda26_alcohol_code: '', //
            uda27_alcohol_degree: '', //
            item_number_type: '', //
            uda29_safety_control_type: '', //
            uda30_safety_control: '', //
            uda2_special_purpose: '', //
            uda9_ingredient_item: '', //
            uda11_long_name_thai: '', //
            uda12_long_name_eng: '', //
            uda13_short_name_thai: '', //
            uda14_short_name_eng: '', //
            uda56_product_knowledge: '', //
            height_dimension: '', //
            width_dimension: '', //
            depth_dimension: '', //
            uda22_store_stock_day: '', //
            uda23_expiry_date_day: '', //
            vat_code: '', //
            flavor: '', // recheck
            scent: '', //
            size: '', //
            color: '', //
            product_classification: '', //
            new_arrival_flag: '', //

            new_arrival_from: '', //เพิ่มมาใหม่
            new_arrival_to: '', //เพิ่มมาใหม่

            created_date: '', //

            //เพิ่มแต่ SET เป็น NULL ไว้

            product_description_en: '',
            product_description_th: '', //
          },
        };
        this.createimgOutput = {
          channel: 'TOL',
          image: {
            product_images: [],
            infographics: [],
            last_update_date: '',
          },
        };
        await this.clubbarcode(ShowVariations.barcode);
        await this.clubimg(ShowVariations.images);
        await this.clubInfographic(ShowVariations.infographics);
        for (let ShowAttributes of ShowVariations.attributes) {
          await this.ONLINE001(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE002(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE003(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE004(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE005(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE006(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE007(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE008(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE009(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE010(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE011(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE012(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE013(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE014(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE015(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE016(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE017(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE018(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE019(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE020(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE021(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE022(ShowAttributes.key, ShowAttributes.value); //23,24
          await this.ONLINE025(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE026(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE027(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE028(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE029(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE030(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE031(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE032(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE033(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE034(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE035(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE036(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE037(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE038(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE039(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE040(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE041(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE042(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE043(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE044(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE045(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE046(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE047(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE048(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE049(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE050(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE051(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE052(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE053(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE054(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE055(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE056(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE057(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE058(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE061(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE062(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE063(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE064(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE065(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE066(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE067(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE068(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE069(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE071(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE133(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE134(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE135(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE136(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE137(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE138(ShowAttributes.key, ShowAttributes.value);
          await this.ONLINE139(ShowAttributes.key, ShowAttributes.value);
        }

        if (this.createOutput.product.ad_name_thai === '') {
          this.createOutput.product.ad_name_thai = ShowProducts.name_th;
        }
        if (this.createOutput.product.ad_name_eng === '') {
          this.createOutput.product.ad_name_eng = ShowProducts.name_en;
        }
        if (this.createOutput.product.product_description_th === '') {
          this.createOutput.product.product_description_th =
            ShowProducts.desc_th;
        }
        if (this.createOutput.product.product_description_en === '') {
          this.createOutput.product.product_description_en =
            ShowProducts.desc_en;
        }

        await this.lastUpdateDate();

        const productPayload: any = this.createOutput;
        const imagePayload: any = this.createimgOutput;

        await this.sqsService.publish(process.env.product_queue, {
          id: 'P' + ShowVariations.id,
          body: productPayload,
        });

        this.logger.debug("Submit message to kafka queue : " + process.env.kafka_product_queue + " with message [" + JSON.stringify(inPutKafka) + "].");
        this.clientKafka.emit(process.env.kafka_product_queue, JSON.stringify(inPutKafka));
        this.logger.debug("Submit message to kafka queue : " + process.env.kafka_product_queue + " successfully.");

        await this.sqsService.publish(process.env.image_queue, {
          id: 'I' + ShowVariations.id,
          body: imagePayload,
        });

        this.logger.debug("Submit message to kafka queue : " + process.env.kafka_image_queue + " with message [" + JSON.stringify(inPutKafka) + "].");
        this.clientKafka.emit(process.env.kafka_image_queue, JSON.stringify(inPutKafka));
        this.logger.debug("Submit message to kafka queue : " + process.env.kafka_image_queue + " successfully.");
    
        await this.amqpConnection.publish(
          process.env.exchangesNameProduct,
          process.env.exchangeRouteProduct,
          ShowVariations.id,
        );
      }
    }
  }
}

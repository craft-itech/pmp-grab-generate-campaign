import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity(process.env.TABLE_PROMOTION_GRABMART)
export class PromotionGrabmartEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  //ADD,UPDATE,DELETE
  @Column({ length: 10, name: 'promotion_mode' })
  promotion_mode: string;

  @Column({ length: 50, name: 'promotion_no' })
  promotion_no: string;

  @Column({ length: 20, name: 'start_date' })
  start_date: string;

  @Column({ length: 20, name: 'end_date' })
  end_date: string;

  @Column({ length: 50, name: 'store_id' })
  store_id: string;

  @Column({ length: 20, name: 'promotion_type' })
  promotion_type: string;

  @Column({ length: 20, name: 'grab_promotion_type' })
  grab_promotion_type: string;

  @Column({ length: 5, name: 'bundle_qty' })
  bundle_qty: string;

  @Column({ length: 10, name: 'campaign_value' })
  campaign_value: string;

  @Column({ length: 255, name: 'custom_tag' })
  custom_tag: string;

  @Column({ name: 'barcode' })
  barcode: string;

  @Column({ length: 20, name: 'last_update_date' })
  last_update_date: string;

  @Column({ length: 5, name: 'bu' })
  bu: string;

  @Column({ length: 20, name: 'merchant_id' })
  merchant_id: string;

  @Column({ type: 'bigint', name: 'status' })
  status: number;

  @Column({ length: 50, name: 'campaign_id' })
  campaign_id: string;

  @Column({ type: 'timestamp', name: 'created_date' })
  created_date: Date;

  @Column({ type: 'timestamp', name: 'updated_date' })
  updated_date: Date;

  @Column({ name: 'error_msg' })
  error_msg: string;
}

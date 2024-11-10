import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cfgsmp_promotion_txns')
export class PromotionTxnEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ length: 20, name: 'end_date' })
  end_date: string;

  @Column({ length: 50, name: 'promotion_no' })
  promotion_no: string;

  @Column({ length: 50, name: 'store_id' })
  store_id: string;

  @Column({ length: 20, name: 'promotion_type' })
  promotion_type: string;

  @Column({ length: 10, name: 'mm_discount' })
  mm_discount: string;

  @Column({ length: 10, name: 'normal_price' })
  normal_price: string;

  @Column({ length: 10, name: 'special_price' })
  special_price: string;

  @Column({ length: 20, name: 'barcode' })
  barcode: string;

  @Column({ length: 20, name: 'start_date' })
  start_date: string;

  @Column({ length: 20, name: 'last_update_date' })
  last_update_date: string;

  @Column({ length: 5, name: 'bu' })
  bu: string;

  @Column({ length: 20, name: 'item_ref' })
  item_ref: string;

  @Column({ length: 4, name: 'channel_id' })
  channel_id: string;

  @Column({ length: 20, name: 'merchant_id' })
  merchant_id: string;

  @Column({ type: 'bigint', name: 'status' })
  status: number;

  @Column({ type: 'timestamp', name: 'txn_date' })
  txn_date: Date;

  @Column({ length: 50, name: 'topic' })
  topic: string;
}

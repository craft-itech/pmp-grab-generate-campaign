import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cfgsmp_master_grabmart')
export class MasterGrabmartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //ADD,UPDATE,DELETE
  @Column({ length: 20, name: 'barcode' })
  barcode: string;

  @Column({ length: 50, name: 'seller_id' })
  seller_id: string;

  @Column({ type: 'bigint', name: 'status' })
  status: number;

  @Column({ type: 'bit', name: 'sold_by_weight' })
  sold_by_weight: boolean;

  @Column({ length: '120', name: 'weight_unit' })
  weight_unit: string;

  @Column({ type: 'float', name: 'weight_value' })
  weigth_value: number;


}

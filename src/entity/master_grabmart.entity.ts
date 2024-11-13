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
}

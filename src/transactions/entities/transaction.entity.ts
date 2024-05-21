import { Item } from 'src/items/entities/item.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.transaction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item' })
  item: Item;

  @Column({ name: 'stock_history' })
  stockHistory: number;

  @Column()
  amount: number;

  @Column({ name: 'transaction_date' })
  transactionDate: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
  })
  deletedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}

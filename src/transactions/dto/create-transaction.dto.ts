import { Item } from 'src/items/entities/item.entity';

export class CreateTransactionDto {
  item: Item;
  amount: number;
}

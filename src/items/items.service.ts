import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}
  create(createItemDto: CreateItemDto) {
    const newItem = this.itemRepository.create(createItemDto);

    return this.itemRepository.save(newItem);
  }

  findAll() {
    return this.itemRepository.find();
  }

  findOne(id: number) {
    try {
      const item = this.itemRepository.findOneBy({ id });

      if (!item) throw new NotFoundException('Item not found.');

      return item;
    } catch (error) {
      throw error;
    }
  }

  async updateStockAmount(item: Item, amount: number) {
    const result = await this.findOne(item.id);

    result.stock -= amount;

    this.itemRepository.save(result);
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.findOne(id);

    return this.itemRepository.save({ ...item, ...updateItemDto });
  }

  async remove(id: number) {
    const item = await this.findOne(id);

    return this.itemRepository.remove(item);
  }
}

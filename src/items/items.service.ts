import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOperatorType,
  FindOptions,
  ILike,
  Repository,
} from 'typeorm';

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

  async findAll(sortBy?: string, order?: string) {
    const findOptions: any = {};

    if (sortBy && order) {
      findOptions.order = {
        [sortBy]: order,
      };
    }

    return await this.itemRepository.find(findOptions);
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

  async findByFilters(
    startDate: Date,
    endDate: Date,
    itemName: string,
    sortBy?: string,
    order?: string,
  ) {
    const findOptions: any = {
      where: {
        createdAt: Between(startDate, endDate),
        name: ILike(`%${itemName}%`),
      },
    };
    if (sortBy && order) {
      findOptions.order = {
        [sortBy]: order,
      };
    }

    return await this.itemRepository.find(findOptions);
  }

  async findBetweenDate(
    startDate: Date,
    endDate: Date,
    sortBy?: string,
    order?: string,
  ) {
    const findOptions: any = {
      where: {
        createdAt: Between(startDate, endDate),
      },
    };

    if (sortBy && order) {
      findOptions.order = {
        [sortBy]: order,
      };
    }

    return await this.itemRepository.find(findOptions);
  }

  async findByName(itemName: string, sortBy?: string, order?: string) {
    const findOptions: any = {
      where: {
        name: ILike(`%${itemName}%`),
      },
    };

    if (sortBy && order) {
      findOptions.order = {
        [sortBy]: order,
      };
    }

    return await this.itemRepository.find(findOptions);
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

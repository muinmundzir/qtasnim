import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private itemsService: ItemsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const newTransaction =
        this.transactionRepository.create(createTransactionDto);

      await this.itemsService.updateStockAmount(
        createTransactionDto.item,
        createTransactionDto.amount,
      );

      return this.transactionRepository.save(newTransaction);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.transactionRepository.find({
      relations: ['item'],
    });
  }

  findOne(id: number) {
    return this.transactionRepository.find({
      relations: ['item'],
      where: {
        id,
      },
    });
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOne(id);

    return this.transactionRepository.save({
      ...transaction,
      ...updateTransactionDto,
    });
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);

    return this.transactionRepository.remove(transaction);
  }

  async findBetweenDate(startDate, endDate) {
    const transactions = await this.transactionRepository.find({
      where: {
        transactionDate: Between(startDate, endDate),
      },
      relations: ['item'],
    });

    return transactions;
  }

  async findByName(itemName: string) {
    const transactions = await this.transactionRepository
      .createQueryBuilder('transactions')
      .leftJoinAndSelect('transactions.item', 'item')
      .where('item.name ilike :itemName', { itemName: `%${itemName}%` })
      .getMany();

    console.log(itemName, 'itemName');
    console.log(transactions, 'transactions');
    return transactions;
  }
}

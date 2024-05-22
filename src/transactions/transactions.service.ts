import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';

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
      const item = await this.itemsService.findOne(
        createTransactionDto.item.id,
      );
      if (item.stock < 1)
        throw new ForbiddenException('Item stock is not sufficient.');

      const newTransaction = this.transactionRepository.create({
        ...createTransactionDto,
        stockHistory: item.stock,
      });

      await this.itemsService.updateStockAmount(
        createTransactionDto.item,
        createTransactionDto.amount,
      );

      return this.transactionRepository.save(newTransaction);
    } catch (error) {
      throw error;
    }
  }

  async findAll(sortBy?: string, order?: string) {
    const findOptions: any = {
      relations: ['item'],
    };

    if (sortBy && order) {
      if (sortBy !== 'name' && sortBy !== 'type') {
        findOptions.order = {
          [sortBy]: order,
        };
      } else {
        findOptions.order = {
          item: {
            [sortBy]: order,
          },
        };
      }
    }

    return await this.transactionRepository.find(findOptions);
  }

  findOne(id: number) {
    return this.transactionRepository.findOne({
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

  async findByFilters(
    startDate: Date,
    endDate: Date,
    itemName: string,
    sortBy?: string,
    order?: string,
  ) {
    const findOptions: any = {
      where: {
        transactionDate: Between(startDate, endDate),
        item: {
          name: ILike(`%${itemName}%`),
        },
      },
      relations: ['item'],
    };

    if (sortBy && order) {
      if (sortBy !== 'name' && sortBy !== 'type') {
        findOptions.order = {
          [sortBy]: order,
        };
      } else {
        findOptions.order = {
          item: {
            [sortBy]: order,
          },
        };
      }
    }

    return await this.transactionRepository.find(findOptions);
  }

  async findBetweenDate(
    startDate: Date,
    endDate: Date,
    sortBy?: string,
    order?: string,
  ) {
    const findOptions: any = {
      where: {
        transactionDate: Between(startDate, endDate),
      },
      relations: ['item'],
    };

    if (sortBy && order) {
      if (sortBy !== 'name' && sortBy !== 'type') {
        findOptions.order = {
          [sortBy]: order,
        };
      } else {
        findOptions.order = {
          item: {
            [sortBy]: order,
          },
        };
      }
    }

    return await this.transactionRepository.find(findOptions);
  }

  async findByName(itemName: string, sortBy?: string, order?: string) {
    const findOptions: any = {
      where: {
        item: {
          name: ILike(`%${itemName}%`),
        },
      },
      relations: ['item'],
    };

    if (sortBy && order) {
      if (sortBy !== 'name' && sortBy !== 'type') {
        findOptions.order = {
          [sortBy]: order,
        };
      } else {
        findOptions.order = {
          item: {
            [sortBy]: order,
          },
        };
      }
    }

    return await this.transactionRepository.find(findOptions);
  }

  async getReports(startDate?: Date, endDate?: Date) {
    const baseQuery = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.item', 'item');

    if (startDate && endDate) {
      baseQuery.where(
        'transaction.transactionDate BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    const mostTransactionsQuery = baseQuery
      .clone()
      .select([
        'DISTINCT ON (item.type) item.type AS itemType',
        'MAX(transaction.amount) AS maxAmount',
      ])
      .groupBy('item.type')
      .orderBy('item.type');

    const mostTransactions = await mostTransactionsQuery.getRawMany();

    const mostTransactionsWithDetails = await Promise.all(
      mostTransactions.map(async (row) => {
        return await this.transactionRepository.findOne({
          where: {
            amount: row.maxamount,
            item: {
              type: row.itemtype,
            },
          },
          relations: ['item'],
        });
      }),
    );

    const leastTransactionsQuery = baseQuery
      .clone()
      .select([
        'DISTINCT ON (item.type) item.type AS itemType',
        'MIN(transaction.amount) AS minAmount',
      ])
      .groupBy('item.type')
      .orderBy('item.type');

    const leastTransactions = await leastTransactionsQuery.getRawMany();

    const leastTransactionsWithDetails = await Promise.all(
      leastTransactions.map(async (row) => {
        return await this.transactionRepository.findOne({
          where: {
            amount: row.minamount,
            item: {
              type: row.itemtype,
            },
          },
          relations: ['item'],
        });
      }),
    );

    return {
      mostTransactions: mostTransactionsWithDetails,
      leastTransactions: leastTransactionsWithDetails,
    };
  }
}

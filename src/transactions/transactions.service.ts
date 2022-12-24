import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  create(createTransactionDto: CreateTransactionDto) {
    const newTransaction =
      this.transactionRepository.create(createTransactionDto);

    return this.transactionRepository.save(newTransaction);
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
}

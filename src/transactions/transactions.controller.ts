import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

interface TransactionInterface {
  id: number;
  itemName: string;
  stockHistory: number;
  soldAmount: number;
  transactionDate: Date;
  itemType: string;
}

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  async findAll(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('itemName') itemName: string,
  ) {
    let query = await this.transactionsService.findAll();
    if (startDate && endDate) {
      query = await this.transactionsService.findBetweenDate(
        startDate,
        endDate,
      );
    }

    if (itemName) query = await this.transactionsService.findByName(itemName);

    if (startDate && endDate && itemName)
      query = await this.transactionsService.findByFilters(
        startDate,
        endDate,
        itemName,
      );

    const transactionsData = query;
    const transactions: TransactionInterface[] = transactionsData?.map(
      (transactionData) => {
        return {
          id: transactionData.id,
          itemName: transactionData.item.name,
          stockHistory: transactionData.stockHistory,
          soldAmount: transactionData.amount,
          transactionDate: transactionData.transactionDate,
          itemType: transactionData.item.type,
        };
      },
    );

    return transactions;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Get('filterDate')
  async findBetween(@Query('startDate') startDate: string) {
    return startDate;
    // const transactionsData = await this.transactionsService.findBetweenDate(
    //   query,
    // );

    // const transactions: TransactionInterface[] = transactionsData.map(
    //   (transactionData) => {
    //     return {
    //       id: transactionData.id,
    //       itemName: transactionData.item.name,
    //       stock: transactionData.item.stock,
    //       soldAmount: transactionData.amount,
    //       transactionDate: transactionData.transactionDate,
    //       itemType: transactionData.item.type,
    //     };
    //   },
    // );
    //
    // return transactions;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}

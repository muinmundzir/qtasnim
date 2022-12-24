import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { dataSourceOption } from 'db/data-source';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOption), ItemsModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

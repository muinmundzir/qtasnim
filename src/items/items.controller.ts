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
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  async findAll(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('itemName') itemName: string,
    @Query('sortBy') sortBy: string,
    @Query('order') order: string,
  ) {
    let query = await this.itemsService.findAll(sortBy, order);

    if (startDate && endDate) {
      query = await this.itemsService.findBetweenDate(
        startDate,
        endDate,
        sortBy,
        order,
      );
    }

    if (itemName)
      query = await this.itemsService.findByName(itemName, sortBy, order);

    if (startDate && endDate && itemName)
      query = await this.itemsService.findByFilters(
        startDate,
        endDate,
        itemName,
        sortBy,
        order,
      );

    return query;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}

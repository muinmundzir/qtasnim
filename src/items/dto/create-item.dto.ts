import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  type: string;
}

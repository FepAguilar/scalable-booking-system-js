import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, IsPositive } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  bookingId!: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty()
  @IsString()
  currency!: string;

  @ApiProperty()
  @IsString()
  status!: string;
}
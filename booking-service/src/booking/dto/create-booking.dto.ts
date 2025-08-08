import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, IsUUID, IsIn } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  workspaceId!: string;

  @ApiProperty({ description: 'ISO 8601 start time' })
  @IsISO8601()
  startTime!: string;

  @ApiProperty({ description: 'ISO 8601 end time' })
  @IsISO8601()
  endTime!: string;

  @ApiProperty({ required: false, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'] })
  @IsOptional()
  @IsIn(['PENDING', 'CONFIRMED', 'CANCELLED'])
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

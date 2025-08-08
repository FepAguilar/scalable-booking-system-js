import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsIn, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @ApiPropertyOptional({ description: 'ISO 8601 start time' })
  @IsOptional()
  @IsISO8601()
  startTime?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 end time' })
  @IsOptional()
  @IsISO8601()
  endTime?: string;

  @ApiPropertyOptional({ enum: ['PENDING', 'CONFIRMED', 'CANCELLED'] })
  @IsOptional()
  @IsIn(['PENDING', 'CONFIRMED', 'CANCELLED'])
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

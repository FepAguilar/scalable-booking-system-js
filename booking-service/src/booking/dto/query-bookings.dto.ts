import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryBookingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  workspaceId?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 start of range' })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 end of range' })
  @IsOptional()
  @IsISO8601()
  to?: string;
}

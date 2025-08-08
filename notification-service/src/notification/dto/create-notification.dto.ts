import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  bookingId!: string;

  @ApiProperty()
  @IsString()
  type!: string;

  @ApiProperty()
  @IsString()
  message!: string;

  @ApiProperty()
  @IsString()
  status!: string;
}

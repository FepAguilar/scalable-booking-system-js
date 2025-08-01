import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'Main Office' })
  name!: string;

  @ApiProperty({
    example: 'This is the primary office location',
    required: false,
  })
  description?: string;
}

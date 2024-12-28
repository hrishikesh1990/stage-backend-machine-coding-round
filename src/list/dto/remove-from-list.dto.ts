import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveFromListDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contentId: string;
}
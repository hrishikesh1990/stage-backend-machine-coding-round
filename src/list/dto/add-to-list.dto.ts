import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToListDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contentType: 'Movie' | 'TVShow';
}

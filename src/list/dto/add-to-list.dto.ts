// src/list/dto/add-to-list.dto.ts
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToListDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contentId: string;

  @ApiProperty({ enum: ['Movie', 'TVShow'] })
  @IsEnum(['Movie', 'TVShow'])
  contentType: 'Movie' | 'TVShow';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}

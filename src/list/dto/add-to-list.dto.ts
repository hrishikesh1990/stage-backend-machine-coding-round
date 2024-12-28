import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToListDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contentId: string;

  @ApiProperty({ enum: ['Movie', 'TVShow'] })
  @IsNotEmpty()
  @IsEnum(['Movie', 'TVShow'])
  contentType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}

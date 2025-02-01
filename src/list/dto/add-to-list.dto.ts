import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToListDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contentId: string;

  @ApiProperty({ enum: ['Movie', 'TVShow'] })
  @IsString()
  @IsIn(['Movie', 'TVShow'])
  contentType: string;
}
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToMyListDto {
  @ApiProperty({
    description: 'The unique username of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The unique ID of the content to be added (Movie or TV Show)',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  contentId: string;

  @ApiProperty({
    description: 'The type of content being added (either Movie or TVShow)',
    enum: ['Movie', 'TVShow'],
    type: String,
  })
  @IsEnum(['Movie', 'TVShow'])
  @IsNotEmpty()
  contentType: 'Movie' | 'TVShow';
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateListItemDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  contentId: string;

  @IsNotEmpty()
  @IsString()
  contentType: 'Movie' | 'TVShow';
}

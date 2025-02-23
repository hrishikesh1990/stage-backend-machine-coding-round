import { IsNotEmpty, IsString, IsArray, IsOptional, ArrayMinSize } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  favoriteGenres?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  dislikedGenres?: string[];

  @IsOptional()
  watchHistory?: {
    contentId: string;
    watchedOn: Date;
    rating: number;
  }[];

  @IsOptional()
  myList?: {
    contentId: string;
    contentType: string;
  }[];
}

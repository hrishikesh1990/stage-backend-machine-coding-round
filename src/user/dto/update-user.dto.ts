import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { genre } from '../../constants/constants';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsArray()
  @IsEnum(genre, { each: true })
  @IsOptional()
  favoriteGenres?: string[];

  @IsArray()
  @IsEnum(genre, { each: true })
  @IsOptional()
  dislikedGenres?: string[];
}

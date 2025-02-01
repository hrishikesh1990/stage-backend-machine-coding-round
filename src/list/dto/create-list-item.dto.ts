import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateListItemDto {
  @ApiProperty({ description: 'Title of the item' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the item' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Type of item (movie/tvshow)' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'ID of the item being added to wishlist' })
  @IsNotEmpty()
  @IsString()
  itemId: string;
}

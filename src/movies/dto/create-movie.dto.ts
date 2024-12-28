import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsDate,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  genres: string[];

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  releaseDate: Date;
  

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  actors: string[];
}

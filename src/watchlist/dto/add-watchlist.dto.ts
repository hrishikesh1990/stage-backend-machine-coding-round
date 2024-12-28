import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class AddWatchlistDto {
  @ApiProperty()
  @IsString()
  @ValidateIf((o) => !o.tvshowId) // movieId is required if tvshowId is not provided
  @IsNotEmpty({ message: 'movieId is required if tvshowId is not provided' })
  movieId?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((o) => !o.movieId) // tvshowId is required if movieId is not provided
  @IsNotEmpty({ message: 'tvshowId is required if movieId is not provided' })
  tvshowId?: string;
}

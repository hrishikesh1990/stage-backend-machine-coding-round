import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Movies')
@Controller('movies')
@UseGuards(ThrottlerGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all movies (cached)' })
  @ApiResponse({ status: 200, description: 'Movies retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const movies = await this.moviesService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Movies retrieved successfully',
        data: movies,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to retrieve movies' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createMovieDto: CreateMovieDto) {
    try {
      const newMovie = await this.moviesService.create(createMovieDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Movie added successfully',
        data: newMovie,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: 'Failed to create movie' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

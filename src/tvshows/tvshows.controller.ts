import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TVShowsService } from './tvshows.service';
import { CreateTVshowDto } from './dto/create-tvshow.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@ApiTags('TV Shows')
@Controller('tvshows')
export class TVShowsController {
  constructor(private readonly tvShowsService: TVShowsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all TV shows' })
  @ApiResponse({ status: 200, description: 'List of TV shows retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAll() {
    try {
      return {
        statusCode: HttpStatus.OK,
        message: 'TV Shows retrieved successfully',
        data: await this.tvShowsService.findAll(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve TV Shows',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new TV Show' })
  @ApiResponse({ status: 201, description: 'TV Show created successfully' })
  @ApiResponse({ status: 400, description: 'Validation Error' })
  async create(@Body() createTVShowDto: CreateTVshowDto) {
    try {
      const newTVShow = await this.tvShowsService.create(createTVShowDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'TV Show created successfully',
        data: newTVShow,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create TV Show',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

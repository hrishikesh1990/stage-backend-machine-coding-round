// src/list/list.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ListService } from './list.servce';

@ApiTags('My List')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Content added to list successfully',
  })
  async addToList(
    @Headers('user-id') userId: string,
    @Body('contentId') contentId: string,
    @Body('contentType') contentType: string,
  ) {
    return this.listService.addToList(userId, contentId, contentType);
  }

  @Delete(':contentId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Content removed from list successfully',
  })
  async removeFromList(
    @Param('contentId') contentId: string,
    @Body('userId') userId: string,
  ) {
    return this.listService.removeFromList(contentId, userId);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of items retrieved successfully',
  })
  async listMyItems(@Headers('user-id') userId: string) {
    return this.listService.listMyItems(userId);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of items retrieved successfully',
  })
  async listUser(@Headers('user-id') userId: string) {
    return this.listService.listUser(userId);
  }
}

import { Controller, Get, Post, Delete, Query, Body, Param } from '@nestjs/common';
import { ListService } from './list.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('List')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}
  
  @Get()
  @ApiOperation({ summary: 'Get the list of items for a user' })
  @ApiResponse({ status: 200, description: 'List fetched successfully.' })
  async getList(
    @Query('userId') userId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.listService.getList(userId, +limit, +offset);
  }

  @Post()
  @ApiOperation({ summary: 'Add items to the user list' })
  @ApiResponse({ status: 201, description: 'Items added successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid items format.' })
  @ApiBody({
    description: 'User and items data',
    type: Object,
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              contentId: { type: 'string' },
              contentType: { type: 'string', enum: ['movie', 'tvshow'] },
            },
          },
        },
      },
    },
  })
  async addToList(
    @Body('userId') userId: string,
    @Body('items') items: { contentId: string; contentType: string }[],
  ) {
    if (!Array.isArray(items)) {
      throw new Error('The "items" field must be an array of objects.');
    }
    return this.listService.addMultipleToList(userId, items);
  }

  @Delete(':contentId')
  @ApiOperation({ summary: 'Remove an item from the user list' })
  @ApiResponse({ status: 200, description: 'Item removed successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found or already removed.' })
  async removeFromList(
    @Param('contentId') contentId: string,
    @Query('userId') userId: string,
  ) {
    return this.listService.removeFromList(userId, contentId);
  }
}
import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { ListService } from './list.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  // GET /list: Lists all items added to the user's list with pagination
  @Get()
  async listMyItems(
    @Query('userId') userId: string, 
    @Query('limit') limit = 10, 
    @Query('offset') offset = 0
  ) {
    return this.listService.listMyItems(userId, limit, offset);
  }

  // POST /list: Adds items to the user's list
  @Post()
  async addToList(
    @Body('userId') userId: string, 
    @Body('contentId') contentId: string, 
    @Body('contentType') contentType: string
  ) {
    return this.listService.addToList(userId, contentId, contentType);
  }

  // DELETE /list: Removes an item from the user's list
  @Delete()
  async removeFromList(
    @Body('userId') userId: string, 
    @Body('contentId') contentId: string, 
    @Body('contentType') contentType: string
  ) {
    return this.listService.removeFromList(userId, contentId, contentType);
  }
}

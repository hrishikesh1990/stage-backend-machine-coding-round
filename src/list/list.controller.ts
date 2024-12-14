import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ListService } from './list.service';
import { ApiTags } from '@nestjs/swagger';
import { AddToListDto } from './dto/add-to-list.dto';

@ApiTags('List')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get(':userId')
  async getMyList(
    @Param('userId') userId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return await this.listService.listItems(userId, limit, offset);
  }

  @Post(':userId')
  async addToMyList(
    @Param('userId') userId: string,
    @Body() body: AddToListDto
  ) {
    return await this.listService.addToList(userId, body);
  }

  @Delete(':userId/:contentId')
  async removeFromWatchlist(
    @Param('userId') userId: string,
    @Param('contentId') contentId: string
  ) {
    return await this.listService.removeFromList(userId, contentId);
  }
}

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { ListService } from './list.service';
import { AddToListDto } from './dto/add-to-list.dto';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  async listMyItems(
    @Query('userId') userId: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('contentType') contentType?: 'Movie' | 'TVShow',
  ) {
    return this.listService.listMyItems(userId, limit, offset, contentType);
  }

  @Post()
  async addToList(
    @Body() addToListDto: AddToListDto,
    @Query('userId') userId: string,
  ) {
    return this.listService.addToList(userId, addToListDto);
  }

  @Delete(':contentId')
  async removeFromList(
    @Param('contentId') contentId: string,
    @Query('userId') userId: string,
  ) {
    return this.listService.removeFromList(userId, contentId);
  }
}

import { Controller, Get, Post, Delete, Query, Body } from '@nestjs/common';
import { UserService } from './list.servce';
import { AddToListDto } from './dto/add-to-list.dto';
import { RemoveFromListDto } from './dto/remove-from-list.dto';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';

@ApiTags('My List')
@Controller('list')
export class ListController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiOperation({ summary: 'Get paginated list with content details' })
  async getList(
    @Query('userId') userId: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.userService.listMyItems(userId, Number(limit), Number(offset));
  }

  @Post()
  @ApiOperation({ summary: 'Add item to list' })
  async addToList(@Body() addToListDto: AddToListDto) {
    return this.userService.addToList(addToListDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove item from list' })
  async removeFromList(@Body() removeFromListDto: RemoveFromListDto) {
    return this.userService.removeFromList(removeFromListDto);
  }
}
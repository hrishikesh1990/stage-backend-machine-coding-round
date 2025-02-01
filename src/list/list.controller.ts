import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ListService } from './list.service';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { ListQueryDto } from './dto/list-query.dto';

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ApiOperation({ summary: "Add an item to user's wishlist" })
  @ApiResponse({ status: 201, description: 'Item added successfully' })
  @ApiResponse({ status: 409, description: 'Item already exists in wishlist' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  create(
    @Param('userId') userId: string,
    @Body() createListItemDto: CreateListItemDto,
  ) {
    return this.listService.addToList(userId, createListItemDto);
  }

  @Get()
  @ApiOperation({ summary: "Get user's wishlist items with pagination" })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  findAll(@Param('userId') userId: string, @Query() query: ListQueryDto) {
    return this.listService.listMyItems(userId, query);
  }

  @Delete(':itemId')
  @HttpCode(204)
  @ApiOperation({ summary: "Remove an item from user's wishlist" })
  @ApiResponse({ status: 204, description: 'Item removed successfully' })
  @ApiResponse({ status: 404, description: 'Item not found in wishlist' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({ name: 'itemId', description: 'ID of the item to remove' })
  remove(@Param('userId') userId: string, @Param('itemId') itemId: string) {
    return this.listService.removeFromList(userId, itemId);
  }
}

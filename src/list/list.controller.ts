import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  Query, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListItemDto } from './dto/create-list-item.dto';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  // ✅ Add item to user's list
  @Post(':userId')
  async addToList(
    @Param('userId') userId: string,
    @Body() createListItemDto: CreateListItemDto
  ) {
    try {
      const item = await this.listService.addToList({ ...createListItemDto, userId });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Item added successfully',
        data: item,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to add item',
        },
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  // ✅ Get user's list with pagination
  @Get(':userId')
  async listMyItems(
    @Param('userId') userId: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0
  ) {
    try {
      const items = await this.listService.listMyItems(userId, limit, offset);
      return {
        statusCode: HttpStatus.OK,
        message: 'Items retrieved successfully',
        data: items,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve items',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':userId/:contentId')
  async removeFromList(@Param('userId') userId: string, @Param('contentId') contentId: string) {
    try {
      const result = await this.listService.removeFromList(userId, contentId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Item removed successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to remove item',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

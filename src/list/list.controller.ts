import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  Query, 
  HttpException, 
  HttpStatus ,
  UseGuards
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiTags('List')
@Controller('list')
@UseGuards(ThrottlerGuard) 
export class ListController {
  constructor(private readonly listService: ListService) {}
  @Post(':userId')
  @ApiOperation({ summary: 'Add an item to the list' })
  @ApiResponse({ status: 201, description: 'Item added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
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

  @Get(':userId')
  @ApiOperation({ summary: 'Get user\'s list with pagination' })
  @ApiResponse({ status: 200, description: 'Items retrieved successfully' })
 
  async listMyItems(
    @Param('userId') userId: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('contentType') contentType?: string

  ) {
    try {
      const items = await this.listService.listMyItems(userId, limit, offset,contentType);
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
  @Post('/bulk/:userId')
  async bulkAddToList(
    @Param('userId') userId: string,
    @Body() items: CreateListItemDto[]
  ) {
    try {
      const updatedList = await this.listService.bulkAddToList(
        userId,
        items.map(item => ({ ...item, userId }))
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Items added successfully',
        data: updatedList,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to add items',
        },
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }
  @Delete(':userId/:contentId')
  @ApiOperation({ summary: 'Remove an item from the list' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
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

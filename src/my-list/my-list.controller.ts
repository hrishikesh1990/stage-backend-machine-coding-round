import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MyListService } from '../my-list/my-list.service';
import { AddToMyListDto } from './dto/my-list.dto'; // DTO for adding an item to the list
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('List')
@Controller('list')
export class MyListController {
  constructor(private readonly myListService: MyListService) {}

  @Get()
  async getMyList(
    @Query('username') username: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Res() res: Response,
  ) {
    try {
      const result = await this.myListService.getMyList(username, page, limit);

      if (result.success) {
        return res.status(200).json({
          message: 'My list fetched successfully',
          data: result.data,
          page,
          limit,
        });
      }

      return res.status(422).json({
        message: result.message,
      });
    } catch (err: any) {
      return res.sendStatus(500);
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) // Ensure validation for request body
  async addToMyList(
    @Body() addToMyListDto: AddToMyListDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.myListService.addToMyList(addToMyListDto);

      if (result.success) {
        return res.status(200).json({
          message: 'Item successfully added to your list',
          data: result.data,
        });
      }

      return res.status(422).json({
        message: result.message || 'Failed to add item to your list',
      });
    } catch (err: any) {
      return res.sendStatus(500);
    }
  }

  @Delete()
  @UsePipes(new ValidationPipe({ transform: true })) // Ensure validation for request body
  async removeFromMyList(
    @Body() removeFromMyListDto: AddToMyListDto,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.myListService.removeFromMyList(removeFromMyListDto);

      if (result.success) {
        return res.status(200).json({
          message: 'Item successfully removed from your list',
          data: result.data,
        });
      }

      return res.status(422).json({
        message: result.message || 'Failed to remove item from your list',
      });
    } catch (err: any) {
      return res.sendStatus(500);
    }
  }
}

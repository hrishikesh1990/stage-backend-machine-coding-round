import { Controller, Get, Post, Delete, Body, Query, UseGuards, Req } from '@nestjs/common';
import { UserService } from './list.service';
import { AddToListDto } from './dto/add-to-list.dto';
import { RemoveFromListDto } from './dto/remove-from-list.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface CustomRequest extends Request {
  user: {
    username: string;
  };
}

@ApiTags('List')
@ApiBearerAuth()
@Controller('list')
export class ListController {
  constructor(private readonly userService: UserService) {}

  // Endpoint to get all item from the user's list
  @UseGuards(JwtAuthGuard)
  @Get()
  async listMyItems(
    @Req() request: CustomRequest,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const username = request.user['username'];
    return this.userService.listMyItems(username, limit, offset);
  }

  // Endpoint to add an item to the user's list
  @UseGuards(JwtAuthGuard)
  @Post()
  async addToList(@Req() request: CustomRequest, @Body() addToListDto: AddToListDto) {
    const username = request.user['username'];
    return this.userService.addToList(username, addToListDto);
  }

  // Endpoint to remove an item from the user's list
  @UseGuards(JwtAuthGuard)
  @Delete()
  async removeFromList(@Req() request: CustomRequest, @Body() removeFromListDto: RemoveFromListDto) {
    const username = request.user['username'];
    return this.userService.removeFromList(username, removeFromListDto);
  }
}
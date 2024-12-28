import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddToListDto } from './dto/add-to-list.dto';
import { RemoveFromListDto } from './dto/remove-from-list.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User List')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post(':userId/list')
  async addToList(
    @Param('userId') userId: string,
    @Body() addToListDto: AddToListDto,
  ) {
    return this.userService.addToList(userId, addToListDto);
  }

  @Delete(':userId/list')
  async removeFromList(
    @Param('userId') userId: string,
    @Body() removeFromListDto: RemoveFromListDto,
  ) {
    return this.userService.removeFromList(userId, removeFromListDto);
  }

  @Get(':userId/list')
  async listMyItems(
    @Param('userId') userId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.userService.listMyItems(userId, limit, offset);
  }
}

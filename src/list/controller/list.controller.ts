import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ListService } from '../service/list.servce';
import { AddToListDto } from '../dto/add-to-list.dto';
import { RemoveFromListDto } from '../dto/remove-from-list.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('List')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('search') search: string,
  ) {
    const userId = req.user.userId;
    console.log(limit, offset, search);
    return this.listService.findAll(userId, limit, offset, search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addToList(@Req() req, @Body() addToListDto: AddToListDto) {
    const userId = req.user.userId;
    return this.listService.addToList(userId, addToListDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async removeFromList(
    @Req() req,
    @Body() removeFromListDto: RemoveFromListDto,
  ) {
    const userId = req.user.userId;
    return this.listService.removeFromList(userId, removeFromListDto);
  }
}

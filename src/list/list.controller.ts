import { Controller, Get, Post, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { ListService } from './list.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('My List')
@ApiBearerAuth()
@Controller('list')
@UseGuards(JwtAuthGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async addToList(
    @Body() addToListDto: { contentId: string; contentType: string },
    @Req() req: any,
  ) {
    return this.listService.addToList({
      ...addToListDto,
      username: req.user.username,
    });
  }

  @Delete()
  async removeFromList(
    @Body() removeFromListDto: { contentId: string },
    @Req() req: any,
  ) {
    return this.listService.removeFromList({
      ...removeFromListDto,
      username: req.user.username,
    });
  }

  @Get()
  async getList(@Req() req: any) {
    return this.listService.getList(req.user.username);
  }
}

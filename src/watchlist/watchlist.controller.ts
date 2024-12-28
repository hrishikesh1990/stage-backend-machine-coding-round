import { Controller, Get, Post, Delete, Body, Query, UseGuards, Request } from '@nestjs/common';
import { WatchListService } from './watchlist.service';
import { JwtAuthGuard } from 'src/guard/jwt.auth.guard';
import { GetWatchlistDto } from './dto/get-watchlist.dto';
import { AddWatchlistDto } from './dto/add-watchlist.dto';
import { DeleteWatchlistDto } from './dto/delete-watchlist.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('watchlist')
@ApiTags('watchlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WatchListController {
  constructor(private readonly watchListService: WatchListService) {}

  @Get()
  async getWatchList(
    @Request() req, 
    @Query('') watchlistDto:GetWatchlistDto
  ) {
    return this.watchListService.getWatchList(req.user.userId, watchlistDto);
  }

  @Post()
  async addToList(
    @Request() req, 
    @Body('') addWatchlistDto:AddWatchlistDto
    
  ) {
    return this.watchListService.addToList(req.user.userId, addWatchlistDto);
  }

  @Delete()
  async removeFromList(
    @Request() req, 
    @Body() removeDto: DeleteWatchlistDto,
  ) {
    return this.watchListService.removeFromList(req.user.userId, removeDto);
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { Watchlist } from '../models/watchlist.schema';
import { Movie } from '../models/movie.schema';
import { TVShow } from '../models/tvshow.schema';

@Injectable()
export class WatchListService {
  constructor(
    @InjectModel(Watchlist.name) private watchListModel: Model<Watchlist>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShow>,
  ) {}

  async getWatchList(userId: string, watchlistDto) {
    const { limit, offset } = watchlistDto;
    return await this.watchListModel
      .find({ userId })
      .skip(offset)
      .limit(limit)
      .populate('movie') 
      .populate('tvShow');
  }

  async addToList(userId: string, dto) {
    const { movieId, tvshowId } = dto;
    console.log("dto is", dto)
    let existingItem = false;
    if(movieId) {
        const data =  await this.movieModel.findById(movieId)
        if(data) {
            existingItem = true;
        }
    } 
    if (tvshowId) {
        const data = await this.tvShowModel.findById(tvshowId)
        if(data) {
            existingItem = true;
        }
    }
    if (!existingItem) {
      throw new NotFoundException('Item not found');
    }

    const existingWatchListItem = await this.watchListModel.findOne({
        userId,
        $or: [
          { movie: new Types.ObjectId(movieId) },
          { tvShow: new Types.ObjectId(tvshowId) },
        ],
      });
      console.log("existingWatchListItem", existingWatchListItem)
      if (existingWatchListItem) {
        throw new BadRequestException('Item already added to the watch list');
      }

    const watchListItem = new this.watchListModel({ userId });

    if (movieId) {
      watchListItem.movie = movieId;
    }

    if (tvshowId) {
      watchListItem.tvShow = tvshowId;
    }

    await watchListItem.save();
    return watchListItem;
  }


  async removeFromList(userId: string, dto) {
    const { watchlistId } = dto;
    const watchListItem = await this.watchListModel.findOneAndDelete({ userId, _id: new Types.ObjectId(watchlistId) });
    return { message: 'Item removed from watch list', watchListItem };
  }
}

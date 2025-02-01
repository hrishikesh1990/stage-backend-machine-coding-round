import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddToListDto } from './dto/add-to-list.dto';
import { List, ListDocument } from '../models/list.schema';
import { Movie } from '../models/movie.schema';
import { TVShow } from '../models/tvshow.schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name) private readonly listModel: Model<ListDocument>,
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(TVShow.name) private readonly tvShowModel: Model<TVShow>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async addToList(userId: string, addToListDto: AddToListDto) {
    const exists = await this.listModel.findOne({
      contentId: addToListDto.contentId,
      contentType: addToListDto.contentType,
      userId,
    });

    if (exists) {
      throw new Error('Item already in the list');
    }

    const newItem = new this.listModel({ ...addToListDto, userId });
    await newItem.save();
    await this.cacheManager.del(`userList_${userId}`);
    return newItem;
  }

  async removeFromList(userId: string, contentId: string) {
    const result = await this.listModel.deleteOne({ contentId, userId });
    if (result.deletedCount === 0) {
      throw new Error('Item not found in the list');
    }
    await this.cacheManager.del(`userList_${userId}`);
    return { message: 'Item removed successfully' };
  }

  async listMyItems(
    userId: string,
    limit: number,
    offset: number,
    contentType?: 'Movie' | 'TVShow',
  ) {
    const cacheKey = `userList_${userId}_${contentType || 'all'}_${limit}_${offset}`;
    const cachedItems = await this.cacheManager.get(cacheKey);
    if (cachedItems) {
      console.log('CACHE HIT...');
      return cachedItems;
    }

    const query: { userId: string; contentType?: 'Movie' | 'TVShow' } = {
      userId,
    };
    if (contentType) {
      query.contentType = contentType;
    }

    const listItems = await this.listModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .exec();

    const movieIds = listItems
      .filter((item) => item.contentType === 'Movie')
      .map((item) => item.contentId);
    const tvShowIds = listItems
      .filter((item) => item.contentType === 'TVShow')
      .map((item) => item.contentId);

    const [movies, tvShows] = await Promise.all([
      this.movieModel.find({ _id: { $in: movieIds } }).exec(),
      this.tvShowModel.find({ _id: { $in: tvShowIds } }).exec(),
    ]);

    const movieMap = new Map(
      movies.map((movie) => [movie._id.toString(), movie]),
    );
    const tvShowMap = new Map(
      tvShows.map((tvShow) => [tvShow._id.toString(), tvShow]),
    );

    const aggregatedItems = listItems.map((item) => {
      let content;
      if (item.contentType === 'Movie') {
        content = movieMap.get(item.contentId);
      } else if (item.contentType === 'TVShow') {
        content = tvShowMap.get(item.contentId);
      }
      return { ...item.toObject(), content };
    });

    await this.cacheManager.set(cacheKey, aggregatedItems);

    return aggregatedItems;
  }
}

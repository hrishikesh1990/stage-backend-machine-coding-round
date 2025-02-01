import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { List, ListDocument } from '../models/list.schema';
import { User, UserDocument } from '../models/user.schema';
import { Movie, MovieDocument } from '../models/movie.schema';
import { TVShow, TVShowDocument } from '../models/tvshow.schema';


@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name) private listModel: Model<ListDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(TVShow.name) private tvshowModel: Model<TVShowDocument>,
  ) { }

  async addToList(userId: string, contentId: string, contentType: string) {
    const user = await this.userModel.findOne({ username: userId });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (user.myList.some(item => item.contentId === contentId)) {
      throw new BadRequestException(`Content ${contentId} already in list`);
    }

    if (contentType === 'Movie') {
      const movie = await this.movieModel.findOne({ _id: contentId });
      if (!movie) {
        throw new NotFoundException(`Movie ${contentId} not found`);
      }
    } else if (contentType === 'TVShow') {
      const tvshow = await this.tvshowModel.findOne({ _id: contentId });
      if (!tvshow) {
        throw new NotFoundException(`TVShow ${contentId} not found`);
      }
    } else {
      throw new BadRequestException(`Invalid content type: ${contentType}`);
    }

    user.myList.push({ contentId, contentType, createdAt: new Date() });
    await user.save();
  }

  async removeFromList(userId: string, contentId: string) {
    const user = await this.userModel.findOne({ username: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    user.myList = user.myList.filter(item => item.contentId !== contentId);
    await user.save();
  }

  async listMyItems(userId: string, contentType?: string) {
    const user = await this.userModel.findOne({ username: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    const myList = user.myList;

    // populate the list with the content
    const items = await Promise.all(myList.map(async (item) => {
      if (item.contentType === 'Movie') {
        const movie = await this.movieModel.findById(item.contentId);
        return { ...item, ...movie.toObject({ getters: true, versionKey: false })};
      } else if (item.contentType === 'TVShow') {
        const tvshow = await this.tvshowModel.findById(item.contentId);
        return { ...item, ...tvshow.toObject({ getters: true, versionKey: false }) };
      }
    }));

    return items;
    // let items = [];

    // if (!contentType || contentType === 'movies') {

    // }

    // if (!contentType || contentType === 'tvshows') {
    //   const tvshows = await this.tvshowModel.find(
    //     { _id: { $in: myList.map(item => item.contentId) } },
    //     // { contentType: 'TVShow' }
    //   );
    //   items.push(...tvshows);
    // }
    // return items;
  }

  async listUser(userId: string) {
    const user = await this.userModel.findOne({ username: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    return user;
  }
}

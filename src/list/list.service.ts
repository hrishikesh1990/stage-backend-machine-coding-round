import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { Movie, MovieDocument } from '../models/movie.schema';
import { TVShow, TVShowDocument } from '../models/tvshow.schema';
import { PaginatedResponse } from './list.module';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(TVShow.name) private tvshowModel: Model<TVShowDocument>,
  ) { }

  async addToList(userId: string, contentId: string, contentType: string) {
    const user = await this.userModel.findOne(
      { username: userId },
      {
        myList: {
          $elemMatch: { contentId }
        }
      }
    );

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

    await this.userModel.updateOne({ username: userId }, { $push: { myList: { contentId, contentType, createdAt: new Date() } } });

    // user.myList.push({ contentId, contentType, createdAt: new Date() });
    // await user.save();
  }

  async removeFromList(userId: string, contentId: string) {
    const result = await this.userModel.updateOne({ username: userId }, { $pull: { myList: { contentId } } });
    if (result.modifiedCount === 0) {
      throw new NotFoundException(`Content ${contentId} not found in list`);
    }
  }

  async listMyItems(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse> {
    const skip = (page - 1) * limit;
    const user = (await this.userModel.findOne(
      { username: userId },
      {
        myList: {
          $slice: [skip, limit],
        },
        total: {
          $size: "$myList"
        }
      }
    )).toJSON();

    //@ts-ignore
    const total = user.total || 0;

    return {
      items: user.myList || [],
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async listUser(userId: string) {
    const user = await this.userModel.findOne({ username: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    return user;
  }
}

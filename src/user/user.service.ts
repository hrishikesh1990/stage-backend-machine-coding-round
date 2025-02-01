import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { TVShow, TVShowDocument } from '../models/tvshow.schema';
import { Movie, MovieDocument } from '../models/movie.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShowDocument>,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>
  ) {}

  async addToList(userId: string, item: { contentId: string; contentType: string }) {
    // Validate contentId before proceeding
    if (!await this.isValidContentId(item.contentId)) {
      throw new Error('Invalid content ID');
    }
    
    const user = await this.userModel.findById(userId);
    if (user && !user.myList.some(existingItem => existingItem.contentId === item.contentId)) {
      return this.userModel.findByIdAndUpdate(
        userId,
        { $addToSet: { myList: item } },
        { new: true }
      );
    }
    return user;
  }

  async removeFromList(userId: string, contentId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { myList: { contentId } } },
      { new: true }
    );
  }

  async listMyItems(userId: string) {
    const user = await this.userModel.findById(userId);
    return user ? user.myList : null;
  }

  async listUser(userId: string) {
    return this.userModel.findById(userId);
  }

  async isValidContentId(contentId: string): Promise<boolean> {
    const tvExists = await this.tvShowModel.exists({ _id: contentId }) !== null;
    const movieExists = await this.movieModel.exists({ _id: contentId }) !== null;
    return tvExists || movieExists;
  }
}


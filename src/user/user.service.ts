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

  async addToList(userId: string, contentId: string) {
    try {
      const {isValid, contentType} = await this.isValidContentId(contentId);
      if (!isValid) {
        throw new Error('Invalid content ID');
      }

      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: userId, 'myList.contentId': { $ne: contentId } },
        { $addToSet: { myList: {contentId, contentType} } },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.error('Error adding to list:', error);
      throw new Error('Could not add to list');
    }
  }

  async removeFromList(userId: string, contentId: string) {
    try {
      return await this.userModel.findByIdAndUpdate(
        userId,
        { $pull: { myList: { contentId } } },
        { new: true }
      );
    } catch (error) {
      console.error('Error removing from list:', error);
      throw new Error('Could not remove from list');
    }
  }

  async myListItems(userId: string, limit: number = 10, offset: number = 0) {
    try {
      console.log(`Fetching items for userId: ${userId}, limit: ${limit}, offset: ${offset}`);
      
      const result = await this.userModel.findOne(
        { _id: userId },
        { myList: 1 }
      ).skip(offset).limit(limit).exec();

      console.log('Find result:', result);

      return result ? result.myList : [];
    } catch (error) {
      console.error('Error fetching user items:', error);
      throw new Error('Could not retrieve user items');
    }
  }

  async listUser(userId: string) {
    try {
      return await this.userModel.findById(userId);
    } catch (error) {
      console.error('Error listing user:', error);
      throw new Error('Could not retrieve user');
    }
  }

  async isValidContentId(contentId: string): Promise<{ isValid: boolean; contentType?: string }> {
    try {
      const [tvExists, movieExists] = await Promise.all([
        this.tvShowModel.exists({ _id: contentId }),
        this.movieModel.exists({ _id: contentId })
      ]);

      if (tvExists) {
        return { isValid: true, contentType: 'TVShow' };
      } else if (movieExists) {
        return { isValid: true, contentType: 'Movie' };
      }
      
      return { isValid: false };
    } catch (error) {
      console.error('Error validating content ID:', error);
      throw new Error('Could not validate content ID');
    }
  }

  async listAllUsers() {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Error listing all users:', error);
      throw new Error('Could not retrieve users');
    }
  }
}


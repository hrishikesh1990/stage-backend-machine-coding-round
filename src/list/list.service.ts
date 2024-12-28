import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema'; // Assuming this is the correct path
import { TVShow } from '../models/tvshow.schema'; // Assuming this is the correct path
import { Movie } from '../models/movie.schema'; // Assuming this is the correct path

@Injectable()
export class ListService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShow>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
  ) {}

  // List all items in a user's list with pagination
  async listMyItems(userId: string, limit: number, offset: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Paginate the myList array using slice
    const items = user.myList.slice(offset, offset + limit);
    return items;
  }
  

  // Add an item to a user's list
  async addToList(userId: string, contentId: string, contentType: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the item already exists in the list
    const existingItem = user.myList.find(
      (item) => item.contentId === contentId && item.contentType === contentType,
    );
    if (existingItem) {
      throw new Error('Item already exists in the list');
    }

    // Add the item to the list
    user.myList.push({ contentId, contentType });
    await user.save();
    return user.myList;
  }

  // Remove an item from a user's list
  async removeFromList(userId: string, contentId: string, contentType: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the item exists in the list
    const itemIndex = user.myList.findIndex(
      (item) => item.contentId === contentId && item.contentType === contentType,
    );
    if (itemIndex === -1) {
      throw new Error('Item not found in the list');
    }

    // Remove the item from the list
    user.myList.splice(itemIndex, 1);
    await user.save();
    return user.myList;
  }
}

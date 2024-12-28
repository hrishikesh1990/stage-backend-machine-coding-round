import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { AddToListDto } from './dto/add-to-list.dto';
import { RemoveFromListDto } from './dto/remove-from-list.dto';
import { Movie, MovieDocument } from '../models/movie.schema';
import { TVShow, TVShowDocument } from '../models/tvshow.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShowDocument>,
  ) {}

  // Method to add an item to the user's list
  async addToList(username: string, addToListDto: AddToListDto) {
    const user = await this.userModel.findOne({username});
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const itemExists = user.myList.some(
      (item) => item.contentId === addToListDto.contentId,
    );

    if (itemExists) {
      throw new BadRequestException('Item already in the list');
    }

    user.myList.push(addToListDto);
    await user.save();
    return user.myList;
  }

 
  async removeFromList(username: string, removeFromListDto: RemoveFromListDto) {
    const user = await this.userModel.findOne({username});
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const itemIndex = user.myList.findIndex(
      (item) => item.contentId === removeFromListDto.contentId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in the list');
    }

    user.myList.splice(itemIndex, 1);
    await user.save();
    return user.myList;
  }

 // Method to list items from the user's list with details
  async listMyItems(username: string, limit: number, offset: number) {
    const user = await this.userModel.findOne({username});
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Slice the user's list based on the provided limit and offset
    const items = user.myList.slice(offset, offset + limit);

    // Fetch detailed information for each item based on its content type
    const detailedItems = await Promise.all(
        items.map(async (item) => {
          if (item.contentType === 'Movie') {
            return this.movieModel.findById(item.contentId).exec();
          } else if (item.contentType === 'TVShow') {
            return this.tvShowModel.findById(item.contentId).exec();
          }
        }),
      );
    
      return detailedItems;
  }
}
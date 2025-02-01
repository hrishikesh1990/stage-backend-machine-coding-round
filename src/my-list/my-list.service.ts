import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { MyList, MyListDocument } from '../models/my-list.schema';
import { Movie } from '../models/movie.schema';
import { TVShow } from '../models/tvshow.schema';

@Injectable()
export class MyListService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(MyList.name) private myListModel: Model<MyListDocument>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShow>,
  ) {}

  async getMyList(username: string, page: number = 1, limit: number = 10) {
    const user = await this.userModel.findById(username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Calculate the skip value based on page and limit
    const skip = (page - 1) * limit;

    // Fetch the user's list with pagination
    const myList = await this.myListModel
      .find({ username: username })
      .skip(skip)
      .limit(limit)
      .exec();

    // Populate content details for each list item (Movie or TVShow)
    const populatedList = await Promise.all(
      myList.map(async (item) => {
        let contentDetails = null;
        if (item.contentType === 'Movie') {
          contentDetails = await this.movieModel
            .findById(item.contentId)
            .exec();
        } else if (item.contentType === 'TVShow') {
          contentDetails = await this.tvShowModel
            .findById(item.contentId)
            .exec();
        }
        return { ...item.toObject(), contentDetails };
      }),
    );

    return {
      success: true,
      data: populatedList,
      message: 'List successfully fetched',
    };
  }

  // Add item to the user's list
  async addToMyList(data: {
    username: string;
    contentId: string;
    contentType: 'Movie' | 'TVShow';
  }) {
    const { username, contentId, contentType } = data;
    const user = await this.userModel.findById(username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if content is already in the user's list
    const alreadyInList = await this.myListModel.findOne({
      username: username,
      contentId,
      contentType,
    });
    if (alreadyInList) {
      return { success: false, message: 'Content is already in your list' };
    }

    // Add the content to the list
    const newItem = new this.myListModel({
      username: username,
      contentId,
      contentType,
      addedOn: new Date(),
    });
    await newItem.save();
    return {
      success: true,
      data: { contentId, contentType, addedOn: new Date() },
    };
  }

  // Remove item from the user's list
  async removeFromMyList(data: {
    username: string;
    contentId: string;
    contentType: 'Movie' | 'TVShow';
  }) {
    const { username, contentId, contentType } = data;
    const user = await this.userModel.findById(username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const result = await this.myListModel.deleteOne({
      username: username,
      contentId,
      contentType,
    });
    if (result.deletedCount === 0) {
      return { success: false, message: 'Content not found in your list' };
    }
    return { success: true, data: 'Content removed from your list' };
  }
}

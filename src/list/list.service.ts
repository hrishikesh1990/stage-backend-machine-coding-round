import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.schema';
import { Movie } from '../models/movie.schema';
import { TVShow } from '../models/tvshow.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShow>,
  ) {}

  async addToList({
    contentId,
    contentType,
    username,
  }: {
    contentId: string;
    contentType: string;
    username: string;
  }) {
    const content = await this.verifyContent(contentId, contentType);
    if (!content) {
      throw new NotFoundException(`${contentType} not found`);
    }

    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isDuplicate = user.myList.some(
      (item) => item.contentId.toString() === contentId,
    );
    if (isDuplicate) {
      throw new BadRequestException('Content already in list');
    }

    user.myList.push({ contentId, contentType });
    await user.save();

    return { message: 'Added to list successfully' };
  }

  async removeFromList({
    contentId,
    username,
  }: {
    contentId: string;
    username: string;
  }) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const itemIndex = user.myList.findIndex(
      (item) => item.contentId.toString() === contentId,
    );
    if (itemIndex === -1) {
      throw new NotFoundException('Content not found in list');
    }

    user.myList.splice(itemIndex, 1);
    await user.save();

    return { message: 'Removed from list successfully' };
  }

  async getList(username: string, page: number = 1, limit: number = 10) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const skip = (page - 1) * limit;
    const totalItems = user.myList.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginatedList = user.myList.slice(skip, skip + limit);

    const listWithDetails = await Promise.all(
      paginatedList.map(async (item) => {
        const content = await this.getContentDetails(
          item.contentId,
          item.contentType,
        );
        return {
          ...content.toObject(),
          contentType: item.contentType,
        };
      }),
    );

    return {
      items: listWithDetails,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  private async verifyContent(contentId: string, contentType: string) {
    return contentType === 'Movie'
      ? await this.movieModel.findById(contentId)
      : await this.tvShowModel.findById(contentId);
  }

  private async getContentDetails(contentId: string, contentType: string) {
    return contentType === 'Movie'
      ? await this.movieModel.findById(contentId)
      : await this.tvShowModel.findById(contentId);
  }
}

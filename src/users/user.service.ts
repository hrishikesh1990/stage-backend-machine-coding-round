import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { AddToListDto } from './dto/add-to-list.dto';
import { RemoveFromListDto } from './dto/remove-from-list.dto';
import { Movie, MovieDocument } from '../models/movie.schema';
import { TVShow, TVShowDocument } from 'src/models/tvshow.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
    @InjectModel(TVShow.name)
    private readonly tvShowModel: Model<TVShowDocument>,
  ) { }

  async addToList(userId: string, addToListDto: AddToListDto): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { contentId, contentType } = addToListDto;

    if ((await this.isContentableValid(contentType, contentId)) == false) {
      throw new NotFoundException('Contentable not found');
    }

    const existingItem = user.myList.find(
      (item) =>
        item.contentId === contentId && item.contentType === contentType,
    );
    if (existingItem) {
      throw new UnprocessableEntityException('Item already in the list');
    }

    user.myList.push({ contentId, contentType });
    return user.save();
  }

  async removeFromList(
    userId: string,
    removeFromListDto: RemoveFromListDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { contentId } = removeFromListDto;
    user.myList = user.myList.filter((item) => item.contentId !== contentId);
    return user.save();
  }

  async listMyItems(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const paginatedList = user.myList.slice(offset, offset + limit);
    return { ...user.toObject(), myList: paginatedList };
  }

  private async isContentableValid(contentType, contentId): Promise<boolean> {
    let doesContentableExists = null;

    if (contentType === 'Movie') {
      doesContentableExists = await this.movieModel.exists({ _id: contentId });
    } else if (contentType === 'TVShow') {
      doesContentableExists = await this.tvShowModel.exists({ _id: contentId });
    }

    if (doesContentableExists === null) {
      return false;
    }

    return true;
  }
}

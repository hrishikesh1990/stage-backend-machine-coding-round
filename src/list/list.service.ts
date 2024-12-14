import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { Movie, MovieDocument } from '../models/movie.schema';
import { TVShow, TVShowDocument } from '../models/tvshow.schema';
import { AddToListDto } from './dto/add-to-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
    @InjectModel(TVShow.name) private readonly tvShowModel: Model<TVShowDocument>,
  ) {}

  private async validateContent(contentId: string, contentType: string) {
    if (!['Movie', 'TVShow'].includes(contentType)) {
      throw new BadRequestException(`Invalid contentType: ${contentType}`);
    }

    let contentExists: any = false;

    if (contentType === 'Movie') {
      contentExists = await this.movieModel.exists({ _id: contentId });
    } else if (contentType === 'TVShow') {
      contentExists = await this.tvShowModel.exists({ _id: contentId });
    }

    if (!contentExists) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }
  }

  async addToList(userId: string, item: AddToListDto): Promise<void> {
    if (!item.contentId || !item.contentType) {
      throw new BadRequestException('contentId and contentType are required');
    }

    await this.validateContent(item.contentId, item.contentType);

    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        'myList.contentId': { '$ne': item.contentId },  // Prevents duplicates
      }, 
      { $push: {
          myList: {
            contentId: item.contentId,
            contentType: item.contentType,
          }
        }
      },
      { new: true }
    );
  }

  async removeFromList(userId: string, contentId: string): Promise<void> {
    if (!contentId) {
      throw new BadRequestException('contentId is required');
    }

    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { myList: { contentId: contentId } } },
      { new: true }
    );
  }

  async listItems(userId: string, limit: number, offset: number): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { myList } = user;
    const paginatedList = (myList || []).slice(offset, offset + limit);

    // TODO: Extend movie or tvshow meta keys into watchlist resp. after DB call

    return {
      count: myList.length,
      limit: limit,
      offset: offset,
      items: paginatedList,
    };
  }
}

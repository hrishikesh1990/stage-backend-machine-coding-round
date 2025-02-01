import { Injectable,  NotFoundException, ConflictException, BadRequestException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { Movie, MovieDocument } from '../models/movie.schema';
import { TVShow, TVShowDocument } from '../models/tvshow.schema';
import { AddToListDto } from './dto/add-to-list.dto';
import { RemoveFromListDto } from './dto/remove-from-list.dto';

@Injectable()
export class UserService {
  constructor( @InjectModel(User.name) private userModel: Model<UserDocument>,
  @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  @InjectModel(TVShow.name) private tvShowModel: Model<TVShowDocument>,
) {}

  async addToList(addToListDto: AddToListDto) {
    const { userId, contentId, contentType } = addToListDto;

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const content = contentType === 'Movie' 
      ? await this.movieModel.findById(contentId)
      : await this.tvShowModel.findById(contentId);
      
    if (!content) throw new NotFoundException(`${contentType} not found`);

    const exists = user.myList.some(item => 
      item.contentId.toString() === contentId && item.contentType === contentType
    );
    if (exists) throw new ConflictException('Content already in list');

    user.myList.push({ contentId, contentType });
    await user.save();
    return user.myList;
  }

  async removeFromList(removeFromListDto: RemoveFromListDto) {
    const { userId, contentId, contentType } = removeFromListDto;

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const initialLength = user.myList.length;
    user.myList = user.myList.filter(item => 
      !(item.contentId.toString() === contentId && item.contentType === contentType)
    );

    if (initialLength === user.myList.length) {
      throw new NotFoundException('Item not found in list');
    }

    await user.save();
    return user.myList;
  }

  async listMyItems(userId: string, limit: number, offset: number){
    const user = await this.userModel.findById(userId)
      .select('myList')
      .lean()
      .exec();

    if (!user) throw new NotFoundException('User not found');

    const total = user.myList.length;
    const paginatedItems = user.myList.slice(offset, offset + limit);

    const populatedItems = await Promise.all(
      paginatedItems.map(async item => ({
        ...item,
        content: await this.getContent(item.contentType, item.contentId)
      }))
    );

    return {
      data: populatedItems,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  private async getContent(type: string, id: string) {
    return type === 'Movie'
      ? this.movieModel.findById(id).lean()
      : this.tvShowModel.findById(id).lean();
  }
}

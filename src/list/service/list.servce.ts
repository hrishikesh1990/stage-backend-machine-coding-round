import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../models/user.schema';
import { AddToListDto } from '../dto/add-to-list.dto';
import { RemoveFromListDto } from '../dto/remove-from-list.dto';
import { Movie, MovieDocument } from 'src/models/movie.schema';
import { TVShow, TVShowDocument } from 'src/models/tvshow.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
    @InjectModel(TVShow.name)
    private readonly tvShowModel: Model<TVShowDocument>,
  ) {}

  async findAll(
    userId: string,
    limit: number,
    offset: number,
    search: string,
  ): Promise<any[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const myList = user.myList;

    // Fetch content details with pagination and search
    const contentDetails = await Promise.all(
      myList.map(async (item) => {
        let content;
        if (item.contentType === 'Movie') {
          content = await this.movieModel.findById(item.contentId).exec();
        } else if (item.contentType === 'TVShow') {
          content = await this.tvShowModel.findById(item.contentId).exec();
        }
        return content;
      }),
    );

    // Filter and paginate results
    const filteredContent = contentDetails.filter(
      (content) =>
        content &&
        (!search || content.title.toLowerCase().includes(search.toLowerCase())),
    );

    return filteredContent.slice(offset, offset + limit);
  }

  async addToList(
    userId: string,
    addToListDto: AddToListDto,
  ): Promise<AddToListDto> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    const exists = user.myList.some(
      (item) =>
        item.contentId === addToListDto.contentId &&
        item.contentType === addToListDto.contentType,
    );
    if (exists) {
      throw new BadRequestException('Item already exists in the list');
    }
    user.myList.push(addToListDto);
    await user.save();
    return addToListDto;
  }

  async removeFromList(
    userId: string,
    removeFromListDto: RemoveFromListDto,
  ): Promise<RemoveFromListDto> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    const index = user.myList.findIndex(
      (item) => item.contentId === removeFromListDto.contentId,
    );
    if (index === -1) {
      throw new NotFoundException('Item not found in the list');
    }
    user.myList.splice(index, 1);
    await user.save();
    return removeFromListDto;
  }
}

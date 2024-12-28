import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { AddToListDto } from './dto/add-to-list.dto';
import { RemoveFromListDto } from './dto/remove-from-list.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

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

  async listMyItems(username: string, limit: number, offset: number) {
    const user = await this.userModel.findOne({username});
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const items = user.myList.slice(offset, offset + limit);
    return items;
  }
}
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';

@Injectable()
export class ListService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addToList(userId: string, contentId: string, contentType: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isDuplicate = user.myList.some(
      (item) =>
        item.contentId === contentId && item.contentType === contentType,
    );

    if (isDuplicate) {
      throw new BadRequestException('Content already exists in list');
    }

    user.myList.push({ contentId, contentType });
    await user.save();

    return user.myList;
  }

  async removeFromList(userId: string, contentId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const contentIndex = user.myList.findIndex(
      (item) => item.contentId === contentId,
    );
    if (contentIndex === -1) {
      throw new NotFoundException('Content not found in list');
    }

    user.myList.splice(contentIndex, 1);
    await user.save();

    return user.myList;
  }

  async listMyItems(userId: string) {
    const user = await this.userModel.findById(userId).select('myList');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.myList;
  }

  async listUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}

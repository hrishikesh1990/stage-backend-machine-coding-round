import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { CreateListItemDto } from './dto/create-list-item.dto';

@Injectable()
export class ListService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ✅ Add item to "My List"
  async addToList(createListItemDto: CreateListItemDto) {
    const { userId, contentId, contentType } = createListItemDto;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // ❌ Prevent duplicates
    if (user.myList.some((item) => item.contentId === contentId && item.contentType === contentType)) {
      throw new HttpException('Item already exists in My List', HttpStatus.BAD_REQUEST);
    }

    user.myList.push({ contentId, contentType });
    await user.save();
    return { message: 'Item added successfully', myList: user.myList };
  }

  // ✅ Get "My List" with pagination & filtering
  async listMyItems(userId: string, limit: number = 10, offset: number = 0, contentType?: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    let filteredList = user.myList;
    if (contentType) {
      filteredList = filteredList.filter((item) => item.contentType === contentType);
    }

    return {
      items: filteredList.slice(offset, offset + limit),
      total: filteredList.length,
      limit,
      offset,
    };
  }

  // ✅ Bulk Add Items to "My List"
  async bulkAddToList(userId: string, items: { contentId: string; contentType: string }[]) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newItems = items.filter(
      (item) => !user.myList.some((listItem) => listItem.contentId === item.contentId)
    );

    if (!newItems.length) {
      throw new HttpException('All items already exist in My List', HttpStatus.BAD_REQUEST);
    }

    user.myList.push(...newItems);
    await user.save();
    return { message: 'Items added successfully', myList: user.myList };
  }

  // ✅ Remove an item from "My List"
  async removeFromList(userId: string, contentId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const initialLength = user.myList.length;
    user.myList = user.myList.filter((item) => item.contentId !== contentId);

    if (user.myList.length === initialLength) {
      throw new HttpException('Item not found in My List', HttpStatus.NOT_FOUND);
    }

    await user.save();
    return { message: 'Item removed successfully', myList: user.myList };
  }
}

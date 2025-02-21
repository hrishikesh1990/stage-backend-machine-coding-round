import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { Types } from 'mongoose';

@Injectable()
export class ListService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async addToList(createListItemDto: CreateListItemDto) {
    const { userId, contentId, contentType } = createListItemDto;
  const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  const alreadyExists = user.myList.some(
      (item) => item.contentId === contentId && item.contentType === contentType
    );
    if (alreadyExists) {
      throw new HttpException('Item already exists in the list', HttpStatus.BAD_REQUEST);
    }
    user.myList.push({ contentId, contentType });
    await user.save();

    return { message: 'Item added successfully', myList: user.myList };
  }
  
  async listMyItems(userId: string, limit: number = 10, offset: number = 0) {
     if (!Types.ObjectId.isValid(userId)) {
      throw new HttpException('Invalid userId format', HttpStatus.BAD_REQUEST);
    }
     limit = Number(limit);
    offset = Number(offset);
     const user = await this.userModel
      .findById(userId)
      .select('myList') 
      .lean(); 
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
     const paginatedItems = user.myList;
   
    return {
      items: paginatedItems,
      total: user.myList.length,

    };
  }
  
 async removeFromList(userId: string, contentId: string) {
      const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const initialLength = user.myList.length;
    user.myList = user.myList.filter((item) => item.contentId !== contentId);

    if (user.myList.length === initialLength) {
      throw new HttpException('Item not found in the list', HttpStatus.NOT_FOUND);
    }

     await user.save();
    return { message: 'Item removed successfully', myList: user.myList };
  }
}

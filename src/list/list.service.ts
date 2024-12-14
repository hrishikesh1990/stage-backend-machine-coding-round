import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { List } from './list.schema';

@Injectable()
export class ListService {
  constructor(@InjectModel(List.name) private readonly listModel: Model<List>) {}

  async getList(userId: string, limit: number, offset: number) {
    return this.listModel
      .find({ userId })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async addMultipleToList(
    userId: string,
    items: { contentId: string; contentType: string }[],
  ) {
    if (!Array.isArray(items)) {
      throw new Error('Items must be an array.');
    }

    const existingItems = await this.listModel
      .find({ userId })
      .select('contentId -_id')
      .lean();

    const existingContentIds = new Set(existingItems.map((item) => item.contentId));

    const newItems = items.filter(
      (item) => !existingContentIds.has(item.contentId),
    );

    if (newItems.length === 0) {
      return { message: 'No new items to add.' };
    }

    const addedItems = await this.listModel.insertMany(
      newItems.map((item) => ({ userId, ...item })),
    );

    return { message: 'Items added successfully.', addedItems };
  } 

  async removeFromList(userId: string, contentId: string): Promise<any> {
    const result = await this.listModel.deleteOne({ userId, contentId }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException('Item not found or already removed.');
    }
    
    return { message: 'Item removed successfully.' };
  }
}
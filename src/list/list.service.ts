import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListItem } from './schemas/list-item.schema';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { ListQueryDto } from './dto/list-query.dto';

// refactored the service name to ListService as we are working with list items

@Injectable()
export class ListService {
  constructor(
    @InjectModel(ListItem.name) private listItemModel: Model<ListItem>,
  ) {}

  private validateUser(userId: string): void {
    // TODO: add user validation logic here
    // For now, we'll just check if the user ID is not empty
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
  }

  async addToList(
    userId: string,
    createListItemDto: CreateListItemDto,
  ): Promise<ListItem> {
    this.validateUser(userId);

    try {
      const wishlistItem = new this.listItemModel({
        ...createListItemDto,
        userId,
      });
      return await wishlistItem.save();
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error code
        throw new ConflictException("Item already exists in user's wishlist");
      }
      throw error;
    }
  }

  async listMyItems(userId: string, query: ListQueryDto) {
    this.validateUser(userId);

    const { limit = 10, offset = 0 } = query;
    const items = await this.listItemModel
      .find({ userId })
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.listItemModel.countDocuments({ userId });

    return {
      items,
      total,
      offset,
      limit,
    };
  }

  async removeFromList(userId: string, itemId: string): Promise<void> {
    this.validateUser(userId);

    const result = await this.listItemModel
      .deleteOne({
        userId,
        itemId,
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException("Item not found in user's wishlist");
    }
  }

  // removed listUser() as it is not part of the list service
}

import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {CACHE_MANAGER} from '@nestjs/cache-manager'; 
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config'; 
import { User, UserDocument } from '../models/user.schema';
import { CreateListItemDto } from './dto/create-list-item.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, 
    private configService: ConfigService 
  ) {}

  private async invalidateCache(userId: string, contentType?: string) {
    const cacheKey = contentType ? `user_list_${userId}_${contentType}` : `user_list_${userId}`;
    await this.cacheManager.del(cacheKey);
  }

  async addToList(createListItemDto: CreateListItemDto) {
    const { userId, contentId, contentType } = createListItemDto;
    
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (user.myList.some((item) => item.contentId === contentId && item.contentType === contentType)) {
      throw new HttpException('Item already exists in My List', HttpStatus.BAD_REQUEST);
    }

    user.myList.push({ contentId, contentType });
    await user.save();

    await this.invalidateCache(userId, contentType);

    return { message: 'Item added successfully', myList: user.myList };
  }
  async bulkAddToList(userId: string, items: CreateListItemDto[]) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  
    const existingContentIds = new Set(user.myList.map(item => item.contentId));
    const newItems = items.filter(item => !existingContentIds.has(item.contentId));
  
    if (newItems.length === 0) {
      throw new HttpException('All items already exist in My List', HttpStatus.BAD_REQUEST);
    }
  
    user.myList.push(...newItems);
    await user.save();
  
    await this.invalidateCache(userId); 
  
    return { message: 'Items added successfully', myList: user.myList };
  }
  

  async listMyItems(userId: string, limit: number = 10, offset: number = 0, contentType?: string) {
    const cacheKey = contentType ? `user_list_${userId}_${contentType}` : `user_list_${userId}`;
    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) return cachedData; 
limit=20;
offset=0;
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    let filteredList = user.myList;
    if (contentType) {
      filteredList = filteredList.filter((item) => item.contentType === contentType);
    }

    const response = {
      items: filteredList.slice(offset, offset + limit),
      total: filteredList.length,
      limit,
      offset,
    };

    const cacheTTL = this.configService.get<number>('redis.ttl') || 600000; 
    await this.cacheManager.set(cacheKey, response, cacheTTL );

    return response;
  }

  async removeFromList(userId: string, contentId: string, contentType?: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const initialLength = user.myList.length;
    user.myList = user.myList.filter((item) => !(item.contentId === contentId ));

    if (user.myList.length === initialLength) {
      throw new HttpException('Item not found in My List', HttpStatus.NOT_FOUND);
    }

    await user.save();
    await this.invalidateCache(userId, contentType); 
    return { message: 'Item removed successfully', myList: user.myList };
  }
}

import {
    Injectable,
    BadRequestException,
    NotFoundException,
    ConflictException,
    InternalServerErrorException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { AddToListDto, PaginatedListResponseDto } from './dto/list.dto';

@Injectable()
export class UserService {
  constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async addToList(userId: string, addToListDto: AddToListDto) {
      try {
          const user = await this.userModel.findById(userId);
          if (!user) {
              throw new NotFoundException('User not found');
          }

          // Check for duplicates
          const isDuplicate = user.myList.some(
              item => item.contentId === addToListDto.contentId
          );
          if (isDuplicate) {
              throw new ConflictException('Item already exists in the list');
          }

          user.myList.push({
              contentId: addToListDto.contentId,
              contentType: addToListDto.contentType,
          });

          await user.save();

          return {
              statusCode: 201,
              message: 'Item added successfully',
              item: {
                  contentId: addToListDto.contentId,
                  contentType: addToListDto.contentType
              }
          };
      } catch (error) {
          if (error instanceof NotFoundException ||
              error instanceof ConflictException ||
              error instanceof BadRequestException) {
              throw error;
          }
          throw new InternalServerErrorException('Failed to add item to list');
      }
  }

  async removeFromList(userId: string, contentId: string): Promise<void> {
      try {
          const user = await this.userModel.findById(userId);
          if (!user) {
              throw new NotFoundException('User not found');
          }

          const initialLength = user.myList.length;
          user.myList = user.myList.filter(item => item.contentId !== contentId);

          if (user.myList.length === initialLength) {
              throw new NotFoundException('Item not found in the list');
          }

          await user.save();
        
      } catch (error) {
          if (error instanceof NotFoundException) {
              throw error;
          }
          throw new InternalServerErrorException('Failed to remove item from list');
      }
  }

  async listMyItems(
      userId: string,
      limit: number,
      offset: number
  ): Promise<PaginatedListResponseDto> {
      try {
          const user = await this.userModel.findById(userId);
          if (!user) {
              throw new NotFoundException('User not found');
          }

          // Validate pagination parameters
          if (offset < 0) {
              throw new BadRequestException('Offset cannot be negative');
          }

          if (limit < 1) {
              throw new BadRequestException('Limit must be greater than 0');
          }

          const totalItems = user.myList.length;
          const items = user.myList.slice(offset, offset + limit);
          return {
              items,
              pagination: {
                  total: totalItems,
                  limit,
                  offset,
                  hasMore: offset + limit < totalItems
              }
          };
      } catch (error) {
          if (error instanceof NotFoundException ||
              error instanceof BadRequestException) {
              throw error;
          }
          throw new InternalServerErrorException('Failed to fetch list items');
      }
  }
}
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User, UserDocument } from '../models/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache 
  ) {}

  private async invalidateCache(userId?: string) {
    if (userId) {
      await this.cacheManager.del(`user_profile_${userId}`);
    }
    await this.cacheManager.del('all_users'); 
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ username: createUserDto.username });
    if (existingUser) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }

    const user = new this.userModel(createUserDto);
    await user.save();

    await this.invalidateCache(); 

    return user;
  }
  async testCache() {
    await this.cacheManager.set('test_key', 'Hello Redis!', 600000 );
    const value = await this.cacheManager.get('test_key');
    console.log('Cache Value:', value);
  }
  
  async getUserById(userId: string) {
    const cacheKey = `user_profile_${userId}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    const value = await this.cacheManager.get('test_key');
    console.log('Cache Value:', value);
    if (cachedUser) {
      console.log(` CACHE HIT: Returning cached data for user ${userId}`);
      return cachedUser;
    } else {
      console.log(` CACHE MISS: Fetching from database for user ${userId}`);
    }
  
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  
    await this.cacheManager.set(cacheKey, user, 600000 ); 
    console.log(`CACHE SET: Data cached for user ${userId}`);
  
    return user;
  }
  

  async getAllUsers() {
    const cacheKey = 'all_users';
    const cachedUsers = await this.cacheManager.get<User[]>(cacheKey);

    if (cachedUsers) return cachedUsers; 
    const users = await this.userModel.find();
    if (!users.length) throw new HttpException('No users found', HttpStatus.NOT_FOUND);

    await this.cacheManager.set(cacheKey, users,600000 ); 
    return users;
  }
  async updateUser(userId: string, updateData: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.invalidateCache(userId); 
    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.invalidateCache(userId); 
    return { message: 'User deleted successfully' };
  }
}

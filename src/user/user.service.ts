import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ username: createUserDto.username });

    if (existingUser) {
      throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST);
    }

    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }
  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
 async getAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }
}

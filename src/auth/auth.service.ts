import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = { username, password: 'hashed_password' };
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: any) {

    const dbUser = await this.userModel.findOne({ username: user.username });
    console.log(dbUser);
    if (!dbUser) {
      throw new Error('User not found'); 
    }
    const isPasswordValid = bcrypt.compareSync(user.password, dbUser.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials'); 
    }

    const payload = { username: dbUser.username, userId: dbUser._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { User, UserSchema } from '../models/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // ✅ Register User schema
  ],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './list.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../models/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [ListController],
    providers: [UserService],
    exports: [UserService]
})
export class ListModule { }
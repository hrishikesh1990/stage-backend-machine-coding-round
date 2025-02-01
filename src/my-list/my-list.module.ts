import { Module } from '@nestjs/common';
import { MyListService } from './my-list.service';
import { MyListController } from './my-list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TVShow, TVShowSchema } from '../models/tvshow.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: TVShow.name, schema: TVShowSchema }]), // Register Movie model with Mongoose
  ],
  controllers: [MyListController],
  providers: [MyListService],
})
export class MyListModule {}

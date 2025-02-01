import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.schema';
import { Movie, MovieSchema } from '../models/movie.schema';
import { TVShow, TVShowSchema } from '../models/tvshow.schema';
import { UserService } from './list.servce';
import { ListController } from './list.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    MongooseModule.forFeature([{ name: TVShow.name, schema: TVShowSchema }]),
  ],
  controllers: [ListController],
  providers: [UserService],
})
export class ListModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './controller/list.controller';
import { ListService } from './service/list.servce';
import { User, UserSchema } from '../models/user.schema';
import { TVShow, TVShowSchema } from 'src/models/tvshow.schema';
import { Movie, MovieSchema } from 'src/models/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TVShow.name, schema: TVShowSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}

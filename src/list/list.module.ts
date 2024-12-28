import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.schema'; 
import { TVShow, TVShowSchema } from '../models/tvshow.schema'; 
import { Movie, MovieSchema } from '../models/movie.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TVShow.name, schema: TVShowSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  providers: [ListService],
  controllers: [ListController],
})
export class ListModule {}

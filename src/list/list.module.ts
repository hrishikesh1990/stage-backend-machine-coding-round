import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { User, UserSchema } from '../models/user.schema';

import { Episode, EpisodeSchema } from 'src/models/episode.schema';
import { TVShow, TVShowSchema } from 'src/models/tvshow.schema';
import { Movie, MovieSchema } from 'src/models/movie.schema';
import { List, ListSchema } from 'src/models/list.schema';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Episode.name, schema: EpisodeSchema }]),
    MongooseModule.forFeature([{ name: TVShow.name, schema: TVShowSchema }]),
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    MongooseModule.forFeature([{ name: List.name, schema: ListSchema }]),
  ],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}

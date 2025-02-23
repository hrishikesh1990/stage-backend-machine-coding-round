import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-redis-store';

import { CacheModule } from '@nestjs/cache-manager'; 
import { TVShowsService } from './tvshows.service';
import { TVShowsController } from './tvshows.controller';
import { TVShow, TVShowSchema } from '../models/tvshow.schema';

@Module({
  imports: [
     MongooseModule.forFeature([{ name: TVShow.name, schema: TVShowSchema }]),
   CacheModule.register(),
  ],
  controllers: [TVShowsController],
  providers: [TVShowsService],
})
export class TvshowsModule {}

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { ListModule } from './list/list.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60, // seconds
      max: 100, // maximum number of items in cache
    }),
    MongooseModule.forRoot('mongodb://mongodb:27017/stagedb'),
    MoviesModule,
    TvshowsModule,
    ListModule,
  ],
})
export class AppModule {}

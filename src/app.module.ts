import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListModule } from './list/list.module';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/stagedb'),
    ListModule,
    MoviesModule,
    TvshowsModule,
    SeedModule,
  ],
})
export class AppModule {}

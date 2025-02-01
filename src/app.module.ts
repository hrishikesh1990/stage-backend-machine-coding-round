import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { ListModule } from './list/list.module';
import { SeedService } from './seed/seed.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/stagedb'),
    UsersModule,
    MoviesModule,
    TvshowsModule,
    ListModule,
  ],

  // added seed service to the module
  providers: [SeedService],
})
export class AppModule {}

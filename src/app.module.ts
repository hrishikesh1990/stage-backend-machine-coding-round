import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { UserModule } from './user/user.module';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/stagedb'),
    UserModule,
    MoviesModule,
    TvshowsModule,
  ],
  providers: [SeedService]
})
export class AppModule { }

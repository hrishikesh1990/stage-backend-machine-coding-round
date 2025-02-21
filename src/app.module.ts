import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { ListModule } from './list/list.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/moviees'),
    MoviesModule,
    TvshowsModule,
    ListModule,
    UserModule
  ],
})
export class AppModule {}

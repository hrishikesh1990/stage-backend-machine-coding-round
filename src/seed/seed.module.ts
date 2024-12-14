import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.schema';
import { Movie, MovieSchema } from '../models/movie.schema';
import { TVShow, TVShowSchema } from '../models/tvshow.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: TVShow.name, schema: TVShowSchema },
    ]),
  ],
  controllers: [],
  providers: [SeedService],
})
export class SeedModule {}

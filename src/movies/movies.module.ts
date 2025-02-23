import { Module} from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie, MovieSchema } from '../models/movie.schema';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [    MongooseModule.forFeatureAsync([
      {
        name: Movie.name,
        useFactory: () => {
          const schema = MovieSchema;
          schema.index({ title: 1 });
          return schema;
        },
      },
    ]),

    CacheModule.register(),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}

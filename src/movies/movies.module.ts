import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie, MovieSchema } from '../models/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]), 
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MongooseModule],
})
export class MoviesModule {}

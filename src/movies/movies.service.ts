import { Injectable, Inject} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { Movie, MovieDocument } from '../models/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

   async findAll(): Promise<Movie[]> {
    const cacheKey = 'movies:all';
      const cachedMovies = await this.cacheManager.get<Movie[]>(cacheKey);
    if (cachedMovies) {
      console.log('Returning cached movies');
      return cachedMovies;
    }
   const movies = await this.movieModel.find().exec();
    await this.cacheManager.set(cacheKey, movies, 6000000 ); // Cache for 10 minutes

    return movies;
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(createMovieDto);
    const savedMovie = await createdMovie.save();

    //await this.cacheManager.del('movies:all');

    return savedMovie;
  }
}

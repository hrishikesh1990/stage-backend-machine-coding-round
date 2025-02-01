import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.schema';
import { TVShow } from '../models/tvshow.schema';
import { Movie } from '../models/movie.schema';
import { dummyUsers, dummyMovies, dummyTvShows } from 'src/constants/constants';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(TVShow.name) private tvShowModel: Model<TVShow>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  async seedDatabase() {
    try {
      this.logger.log('Seeding the database...');

      // Clear existing data (optional)
      await this.userModel.deleteMany({});
      await this.tvShowModel.deleteMany({});
      await this.movieModel.deleteMany({});

      // Create mock data
      try {
        await this.userModel.create(dummyUsers);
      } catch (error) {
        console.log('error seeding user');
      }

      try {
        await this.tvShowModel.create(dummyTvShows);
      } catch (error) {
        console.error('Error in seeding tv shows');
      }

      try {
        await this.movieModel.create(dummyMovies);
      } catch (error) {
        console.error('error seeding movies', error);
      }

      this.logger.log('Database seeded successfully');
    } catch (error) {
      this.logger.error('Error seeding database:', error);
    }
  }
}

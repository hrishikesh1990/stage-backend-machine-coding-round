import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.schema';
import { TVShow } from '../models/tvshow.schema';
import { Movie } from '../models/movie.schema';

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

      // Clear existing data
      await this.userModel.deleteMany({});
      await this.tvShowModel.deleteMany({});
      await this.movieModel.deleteMany({});

      // Seed Users
      await this.userModel.create([
        {
          username: 'user1',
          favoriteGenres: ['Action', 'Drama'],
          dislikedGenres: ['Romance'],
          watchHistory: [],
          myList: [],
        },
        {
          username: 'user2',
          favoriteGenres: ['Comedy', 'Adventure'],
          dislikedGenres: ['Horror'],
          watchHistory: [],
          myList: [],
        },
        {
          username: 'user3',
          favoriteGenres: ['SciFi', 'Fantasy'],
          dislikedGenres: ['Crime'],
          watchHistory: [],
          myList: [],
        },
        {
          username: 'user4',
          favoriteGenres: ['Animation', 'Biography'],
          dislikedGenres: ['Thriller'],
          watchHistory: [],
          myList: [],
        },
        {
          username: 'user5',
          favoriteGenres: ['History', 'Mystery'],
          dislikedGenres: ['Action'],
          watchHistory: [],
          myList: [],
        },
      ]);

      // Seed Movies
      await this.movieModel.create([
        {
          title: 'Inception',
          description:
            'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
          genres: ['Action', 'SciFi'],
          releaseDate: new Date('2010-07-16T00:00:00Z'),
          director: 'Christopher Nolan',
          actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
        },
        {
          title: 'The Dark Knight',
          description:
            'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.',
          genres: ['Action', 'Drama'],
          releaseDate: new Date('2008-07-18T00:00:00Z'),
          director: 'Christopher Nolan',
          actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
        },
        {
          title: 'The Matrix',
          description:
            'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
          genres: ['Action', 'SciFi'],
          releaseDate: new Date('1999-03-31T00:00:00Z'),
          director: 'Lana Wachowski, Lilly Wachowski',
          actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
        },
        {
          title: 'The Lord of the Rings: The Fellowship of the Ring',
          description:
            'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
          genres: ['Action', 'Adventure', 'Drama'],
          releaseDate: new Date('2001-12-19T00:00:00Z'),
          director: 'Peter Jackson',
          actors: ['Elijah Wood', 'Ian McKellen', 'Orlando Bloom'],
        },
        {
          title: 'The Lion King',
          description:
            'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
          genres: ['Animation', 'Adventure', 'Drama'],
          releaseDate: new Date('1994-06-24T00:00:00Z'),
          director: 'Roger Allers, Rob Minkoff',
          actors: ['Matthew Broderick', 'Jeremy Irons', 'James Earl Jones'],
        },
      ]);

      // Seed TV Shows
      await this.tvShowModel.create([
        {
          title: 'Breaking Bad',
          description:
            'A high school chemistry teacher turned methamphetamine producer partners with a former student to create a lucrative meth lab.',
          genres: ['Crime', 'Drama', 'Thriller'],
          episodes: [
            {
              episodeNumber: 1,
              seasonNumber: 1,
              title: 'Pilot',
              releaseDate: new Date('2008-01-20T00:00:00Z'),
              director: 'Vince Gilligan',
              actors: ['Bryan Cranston', 'Aaron Paul'],
            },
            {
              episodeNumber: 2,
              seasonNumber: 1,
              title: "Cat's in the Bag...",
              releaseDate: new Date('2008-01-27T00:00:00Z'),
              director: 'Adam Bernstein',
              actors: ['Bryan Cranston', 'Aaron Paul'],
            },
          ],
        },
        {
          title: 'Game of Thrones',
          description:
            'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
          genres: ['Action', 'Adventure', 'Drama'],
          episodes: [
            {
              episodeNumber: 1,
              seasonNumber: 1,
              title: 'Winter Is Coming',
              releaseDate: new Date('2011-04-17T00:00:00Z'),
              director: 'Tim Van Patten',
              actors: ['Emilia Clarke', 'Peter Dinklage'],
            },
            {
              episodeNumber: 2,
              seasonNumber: 1,
              title: 'The Kingsroad',
              releaseDate: new Date('2011-04-24T00:00:00Z'),
              director: 'Tim Van Patten',
              actors: ['Emilia Clarke', 'Peter Dinklage'],
            },
          ],
        },
        {
          title: 'Stranger Things',
          description:
            'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
          genres: ['Drama', 'Fantasy', 'Horror'],
          episodes: [
            {
              episodeNumber: 1,
              seasonNumber: 1,
              title: 'Chapter One: The Vanishing of Will Byers',
              releaseDate: new Date('2016-07-15T00:00:00Z'),
              director: 'The Duffer Brothers',
              actors: ['Winona Ryder', 'David Harbour'],
            },
            {
              episodeNumber: 2,
              seasonNumber: 1,
              title: 'Chapter Two: The Weirdo on Maple Street',
              releaseDate: new Date('2016-07-15T00:00:00Z'),
              director: 'The Duffer Brothers',
              actors: ['Winona Ryder', 'David Harbour'],
            },
          ],
        },
      ]);

      this.logger.log('Database seeded successfully');
    } catch (error) {
      this.logger.error('Error seeding database:', error);
    }
  }
}
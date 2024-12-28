import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from 'src/models/movie.schema';
import { TVShow, TVShowSchema } from 'src/models/tvshow.schema';
import { Watchlist, WatchlistSchema } from 'src/models/watchlist.schema';
import { WatchListService } from './watchlist.service';
import { WatchListController } from './watchlist.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
          { name: Watchlist.name, schema: WatchlistSchema },
          { name: Movie.name, schema: MovieSchema },
          { name: TVShow.name, schema: TVShowSchema },
        ]),
    ],
    providers: [WatchListService],
    controllers: [WatchListController],
})
export class WatchlistModule {}


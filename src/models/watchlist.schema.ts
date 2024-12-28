import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { genre } from '../constants/constants';
import { Movie } from './movie.schema';
import { TVShow } from './tvshow.schema';

export type WatchlistDocument = Watchlist & Document;

@Schema()
export class Watchlist {
  @Prop({ required: true })
  userId: string;


  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Movie.name })
  movie?: Movie; 

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: TVShow.name })
  tvShow?: TVShow; 

}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Episode, EpisodeSchema } from './episode.schema';
import { genre } from '../constants/constants';

export type TVShowDocument = TVShow & Document;

@Schema()
export class TVShow {

  // Index for title searches
  @Prop({ required: true, index: true })
  title: string;

  @Prop({ required: true })
  description: string;

  // Index for genre filtering
  @Prop({
      type: [{ type: String, enum: genre }],
      index: true
  })
  genres: string[];

  @Prop({ type: [EpisodeSchema], default: [] })
  episodes: Episode[];
}

export const TVShowSchema = SchemaFactory.createForClass(TVShow);

// Create compound index for title and genres
TVShowSchema.index({ title: 1, genres: 1 });

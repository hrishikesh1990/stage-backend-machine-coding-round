import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Episode, EpisodeSchema } from './episode.schema';
import { genre } from '../constants/constants';

export type TVShowDocument = TVShow & Document;

@Schema({ timestamps: true }) 
export class TVShow {
  @Prop({ required: true, unique: true, index: true }) 
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [{ type: String, enum: genre }],
    index: true,
  })
  genres: string[];

  @Prop({ type: [EpisodeSchema], default: [] })
  episodes: Episode[];
}

export const TVShowSchema = SchemaFactory.createForClass(TVShow);

TVShowSchema.index({ title: 1 }); 
TVShowSchema.index({ genres: 1 }); 
TVShowSchema.index({ 'episodes._id': 1 }); 

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EpisodeDocument = Episode & Document;

@Schema()
export class Episode {

  // Index for querying episodes by season and episode number
  @Prop({ required: true, index: true })
  episodeNumber: number;

  @Prop({ required: true })
  seasonNumber: number;

  // Index for sorting episodes by release date
  @Prop({ required: true, index: true })
  releaseDate: Date;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String] })
  actors: string[];
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);

// Create compound index for season and episode number
EpisodeSchema.index({ seasonNumber: 1, episodeNumber: 1 });
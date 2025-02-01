import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { genre } from '../constants/constants';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {

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

  // Index for release date sorting
  @Prop({ required: true, index: true })
  releaseDate: Date;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String] })
  actors: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

// Create compound index for title and genres
MovieSchema.index({ title: 1, genres: 1 });
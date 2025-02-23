import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { genre } from '../constants/constants';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true }) 
export class Movie {
  @Prop({ required: true, unique: true, index: true }) 
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [{ type: String, enum: genre }],
    index: true, 
  })
  genres: string[];

  @Prop({ required: true, index: true }) 
  director: string;

  @Prop({ type: [String], index: true })
  actors: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ title: 1 }); 
MovieSchema.index({ genres: 1 }); 
MovieSchema.index({ director: 1 }); 
MovieSchema.index({ actors: 1 });

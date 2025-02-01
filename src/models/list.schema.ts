import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Movie } from './movie.schema';

export type ListDocument = List & Document;

@Schema()
export class List {
  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true })
  contentType: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ListSchema = SchemaFactory.createForClass(List); 
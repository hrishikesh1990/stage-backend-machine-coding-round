import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ListDocument = List & Document;

@Schema()
export class List {
  @Prop({ required: true, type: String })
  contentId: string;

  @Prop({ required: true, enum: ['Movie', 'TVShow'] })
  contentType: 'Movie' | 'TVShow';

  @Prop({ type: String, required: true, index: true })
  userId: string; // Reference to the user who owns this list item
}

export const ListSchema = SchemaFactory.createForClass(List);

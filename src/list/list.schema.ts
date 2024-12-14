import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class List extends Document {
  @Prop({ required: true, index: true })  // Index on userId for faster lookup
  userId: string;

  @Prop({ required: true, index: true })  // Index on contentId for faster lookup
  contentId: string;

  @Prop({ required: true, enum: ['movie', 'tvshow'] })
  contentType: string;
}

export const ListSchema = SchemaFactory.createForClass(List);
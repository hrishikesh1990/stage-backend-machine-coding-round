import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ListItemDocument = ListItem & Document;

@Schema({ timestamps: true })
export class ListItem {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  itemName: string;

  @Prop({ required: true })
  category: string;
}

export const ListItemSchema = SchemaFactory.createForClass(ListItem);

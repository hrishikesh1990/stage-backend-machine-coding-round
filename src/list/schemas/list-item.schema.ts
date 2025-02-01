import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ListItem extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ index: true })
  type: string;

  @Prop({ required: true })
  itemId: string;
}

export const ListItemSchema = SchemaFactory.createForClass(ListItem);

ListItemSchema.index({ userId: 1, itemId: 1 }, { unique: true });

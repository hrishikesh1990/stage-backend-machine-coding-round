import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema'; // Adjust the path as needed

export type MyListDocument = MyList & Document;

@Schema()
export class MyList {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  username: User; // Reference to the User schema

  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true, enum: ['Movie', 'TVShow'] })
  contentType: 'Movie' | 'TVShow';

  @Prop({ required: true })
  addedOn: Date;
}

export const MyListSchema = SchemaFactory.createForClass(MyList);

MyListSchema.index({ username: 1, contentId: 1 });
MyListSchema.index({ contentType: 1 }); // Index for filtering by content type

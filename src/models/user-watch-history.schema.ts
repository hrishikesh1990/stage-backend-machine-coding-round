import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema'; // Adjust the path as needed

export type UserWatchHistoryDocument = UserWatchHistory & Document;

@Schema()
export class UserWatchHistory {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  username: User; // Reference to the User schema

  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true })
  watchedOn: Date;

  @Prop()
  videoToBeResumedAt: number; // Store the time in seconds

  @Prop({ required: true })
  rating: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserWatchHistorySchema =
  SchemaFactory.createForClass(UserWatchHistory);

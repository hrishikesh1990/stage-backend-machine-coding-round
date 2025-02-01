import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { genre } from '../constants/constants';

export type UserDocument = User & Document;

@Schema()
export class User {

  // Index for user lookups
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({
    type: [
      {
        type: String,
        enum: genre,
      },
    ],
  })
  favoriteGenres: string[];

  @Prop({
    type: [
      {
        type: String,
        enum: genre,
      },
    ],
  })
  dislikedGenres: string[];

  // Index for querying watch history
  @Prop([
    {
      contentId: { type: String, required: true },
      watchedOn: { type: Date, required: true },
      rating: { type: Number, min: 1, max: 5 },
    },
  ])
  watchHistory: {
    contentId: string;
    watchedOn: Date;
    rating: number;
  }[];

  // Index for myList queries
  @Prop([
    {
      contentId: { type: String, required: true },
      contentType: { type: String, enum: ['Movie', 'TVShow'], required: true },
    },
  ])
  myList: {
    contentId: string;
    contentType: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create compound indexes for watch history and myList
UserSchema.index({ 'watchHistory.contentId': 1, 'watchHistory.watchedOn': -1 });
UserSchema.index({ 'myList.contentId': 1, 'myList.contentType': 1 });
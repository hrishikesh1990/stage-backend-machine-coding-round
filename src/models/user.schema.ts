import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) 
export class User {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({
    type: [{ type: String }],
    index: true,
  })
  favoriteGenres: string[];

  @Prop({
    type: [{ type: String }],
    index: true,
  })
  dislikedGenres: string[];

  @Prop([
    {
      contentId: { type: String, required: true, index: true }, 
      watchedOn: { type: Date, required: true },
      rating: { type: Number, min: 1, max: 5 },
    },
  ])
  watchHistory: {
    contentId: string;
    watchedOn: Date;
    rating: number;
  }[];

  @Prop([
    {
      contentId: { type: String, required: true, index: true },
      contentType: { type: String, enum: ['Movie', 'TVShow'], required: true },
    },
  ])
  myList: {
    contentId: string;
    contentType: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1, favoriteGenres: 1 });
UserSchema.index({ username: 1, dislikedGenres: 1 });
UserSchema.index({ 'watchHistory.contentId': 1, 'watchHistory.watchedOn': -1 });
UserSchema.index({ 'myList.contentId': 1, 'myList.contentType': 1 });

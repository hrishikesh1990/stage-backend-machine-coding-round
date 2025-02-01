import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema'; // Adjust the path as needed
import { genre } from 'src/constants/constants';

export type UserContentPreferenceDocument = UserContentPreference & Document;

@Schema()
export class UserContentPreference {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  username: User; // Reference to the User schema

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
}

export const UserContentPreferenceSchema = SchemaFactory.createForClass(
  UserContentPreference,
);

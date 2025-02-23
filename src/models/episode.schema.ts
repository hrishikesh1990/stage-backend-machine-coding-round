import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EpisodeDocument = Episode & Document;

@Schema({ timestamps: true }) 
export class Episode {
  @Prop({ required: true, index: true }) 
  episodeNumber: number;

  @Prop({ required: true, index: true }) 
  seasonNumber: number;

  @Prop({ required: true, index: true })
  releaseDate: Date;

  @Prop({ required: true, index: true }) 
  director: string;

  @Prop({ type: [String], index: true })
  actors: string[];
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);

EpisodeSchema.index({ seasonNumber: 1, episodeNumber: 1 }); 
EpisodeSchema.index({ releaseDate: 1 }); 
EpisodeSchema.index({ director: 1 });
EpisodeSchema.index({ actors: 1 }); 
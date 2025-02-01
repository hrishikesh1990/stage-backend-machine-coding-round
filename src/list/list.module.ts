import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { User, UserSchema } from '../models/user.schema';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { Movie, MovieSchema } from '../models/movie.schema';
import { TVShow, TVShowSchema } from '../models/tvshow.schema';
import { AuthModule } from '../middleware/auth.module';

export interface PaginatedResponse {
  items: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: TVShow.name, schema: TVShowSchema },
    ]),
    AuthModule,
  ],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'list', method: RequestMethod.GET },    // GET /list
        { path: 'list', method: RequestMethod.POST },   // POST /list
        { path: 'list', method: RequestMethod.DELETE }, // DELETE /list
      );
  }
} 
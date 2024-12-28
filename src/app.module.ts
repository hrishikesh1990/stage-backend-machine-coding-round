import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { SeedModule } from './seed/seed.module';
import { AppLoggerMiddleware } from './middleware/logger.middleware';
import { UserModule } from './users/user.module';
import { User, UserSchema } from './models/user.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/stagedb'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MoviesModule,
    TvshowsModule,
    SeedModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}

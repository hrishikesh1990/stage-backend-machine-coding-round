import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MoviesModule } from '../movies/movies.module';
import { TvshowsModule } from '../tvshows/tvshows.module';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../models/user.schema';
import { ListController } from './list.controller';
import { UserService } from './list.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'my_stage_app',
      signOptions: { expiresIn: '1h' },
    }),
    MoviesModule,
    TvshowsModule,
    AuthModule,
  ],
  controllers: [ListController],
  providers: [UserService],
})
export class ListModule {}
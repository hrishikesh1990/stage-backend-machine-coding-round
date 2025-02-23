import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { ListModule } from './list/list.module';
import { UserModule } from './user/user.module';

import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerConfigModule } from './config/throttler.module';
import   RedisConfigService from './config/redis.config';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/moviees'),
    MoviesModule,
    TvshowsModule,
    ListModule,
    UserModule, ConfigModule.forRoot({ isGlobal: true, load: [  RedisConfigService] }),

    // Throttler (Rate Limiting)
    ThrottlerConfigModule,

    // Redis Cache
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
        ttl: 6000000, // Default cache time: 10 mins
      }),
    }),
  ],
})
export class AppModule {}

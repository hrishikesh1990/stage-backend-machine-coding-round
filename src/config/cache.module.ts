import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        ttl: configService.get<number>('CACHE_TTL', 600), // 10 minutes default TTL
      }),
    }),
  ],
  exports: [CacheModule],
})
export class CacheConfigModule {}

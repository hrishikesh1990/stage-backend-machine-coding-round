import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
            ttl: 60000, 
            limit: 100,  },
      ],
    }),
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard, 
    },
  ],
})
export class ThrottlerConfigModule {}

import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || '',
}));

@Injectable()
export class RedisConfigService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private isConnected = false;
  private readonly logger = new Logger(RedisConfigService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: `redis://${this.configService.get<string>('REDIS_HOST', 'localhost')}:${this.configService.get<number>('REDIS_PORT', 6379)}`,
    });

    this.client.on('error', (err) => this.logger.error(`Redis Error: ${err.message}`));
  }

  async onModuleInit() {
    try {
      if (!this.isConnected) {
        await this.client.connect();
        this.isConnected = true;
        this.logger.log('✅ Connected to Redis');
      }
    } catch (error) {
      this.logger.error(`❌ Redis Connection Failed: ${error.message}`);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Redis GET Error: ${error.message}`);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.set(key, value, { EX: ttl });
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Redis SET Error: ${error.message}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Redis DEL Error: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.isConnected) {
        await this.client.quit();
        this.logger.log('🔌 Redis Client Disconnected');
      }
    } catch (error) {
      this.logger.error(`Redis Disconnect Error: ${error.message}`);
    }
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ListModule } from './list/list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Ensure ConfigModule is global
    MongooseModule.forRoot(process.env.MONGO_URI), // Use the environment variable
    ListModule,
  ],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { List, ListSchema } from './list.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: List.name, schema: ListSchema }])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
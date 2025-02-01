import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ListItem, ListItemSchema } from './schemas/list-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ListItem.name, schema: ListItemSchema },
    ]),
  ],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}

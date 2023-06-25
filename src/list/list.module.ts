import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListResolver } from './list.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  providers: [ListResolver, ListService],
  imports: [
    TypeOrmModule.forFeature([List]),
    ListItemModule
  ],
  exports: [
    ListService,
    TypeOrmModule
  ]
})
export class ListModule {}

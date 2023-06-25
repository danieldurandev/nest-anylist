import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ListService } from './list.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListResolver {
  constructor(
    private readonly listService: ListService,
    private readonly listItemsService: ListItemService,
  ) {}

  @Mutation(() => List)
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User
  ):Promise<List> {
    return this.listService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'list' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ):Promise<List[]> {
    return this.listService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ):Promise<List> {
    return this.listService.findOne(id,user);
  }

  @Mutation(() => List)
  async updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ):Promise<List> {
    return this.listService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  async removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
  ) {
    return this.listService.remove(id, user);
  }

  @ResolveField(()=>[ListItem], {name: "items"})
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<ListItem[]>{


    return this.listItemsService.findAll(list, paginationArgs, searchArgs)
  }

  @ResolveField(()=>Number, {name: "totalItems"})
  async countListItemsByList(
    @Parent() list: List,
  ): Promise<number>{
    return this.listItemsService.countListItemsByList(list)
  }

}

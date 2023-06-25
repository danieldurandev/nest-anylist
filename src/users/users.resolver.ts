import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './args/roles.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { validRoles } from 'src/auth/enums/valid-roles.enum';
import { ItemsService } from 'src/items/items.service';
import { Item } from 'src/items/entities/item.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { ListService } from 'src/list/list.service';
import { List } from 'src/list/entities/list.entity';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listService: ListService
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([validRoles.admin, validRoles.superUser]) user: User
  ):Promise<User[]> {

    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([validRoles.admin, validRoles.superUser]) user: User
  ):Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, {name: "updateUser"})
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([validRoles.admin]) user: User
  ):Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([validRoles.admin]) user: User
  ):Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(()=>Int, {name:"itemCount"})
  async itemCount(
    @Parent() user:User,
    @CurrentUser([validRoles.admin]) adminUser: User
  ):Promise<number> {
    return this.itemsService.itemCountByUser(user)
  }

  @ResolveField(()=>Item, {name:"items"})
  async getItemsByUser(
    @Parent() user:User,
    @Args() paginationsArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser([validRoles.admin]) adminUser: User
  ):Promise<Item[]> {
    return this.itemsService.findAll(user, paginationsArgs, searchArgs)
  }

  @ResolveField(()=>[List], {name:"lists"})
  async getListsByUser(
    @Parent() user:User,
    @Args() paginationsArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser([validRoles.admin]) adminUser: User
  ):Promise<List[]> {
    return this.listService.findAll(user, paginationsArgs, searchArgs)
  }

  @ResolveField(()=>Int, {name:"listCount"})
  async listCount(
    @Parent() user:User,
    @CurrentUser([validRoles.admin]) adminUser: User
  ):Promise<number> {
    return this.listService.listsCountByUser(user)
  }

}

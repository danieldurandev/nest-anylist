import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dtos/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput } from './dtos/inputs/login.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { validRoles } from './enums/valid-roles.enum';


@Resolver()
export class AuthResolver {
  
  constructor(private readonly authService: AuthService) {}

  @Mutation(()=>AuthResponse, {name:"signup"})
  async signup(
    @Args("signupInput") signupInput:SignupInput
  ):Promise<AuthResponse>{
    return this.authService.signup(signupInput)
  }

  @Mutation(()=>AuthResponse,{name:"login"})
  async login(
    @Args("loginInput") loginInput: LoginInput
  ):Promise<AuthResponse>{
    return this.authService.login(loginInput)
  }

  @Query(()=>AuthResponse,{name:"revalidate"})
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser(/*[validRoles.admin]*/) user: User
  ):AuthResponse {
    return this.authService.revalidateToken(user)
  }

}

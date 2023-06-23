import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { validRoles } from 'src/auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [validRoles], {nullable:true})
  @IsArray()
  @IsOptional()
  roles?:validRoles[];

  @Field(() => Boolean, {nullable:true})
  @IsBoolean()
  @IsOptional()
  isActive?:boolean;
}

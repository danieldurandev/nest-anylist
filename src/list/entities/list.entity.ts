import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "lists"})
@ObjectType()
export class List {

  @PrimaryGeneratedColumn("uuid")
  id:string;

  @Column()
  @Field(()=>String)
  name:string;

  @ManyToOne(()=>User, (user) => user.lists, {nullable:false, lazy:true})
  @Index("userId-list-index")
  @Field(()=>User)
  user: User

}

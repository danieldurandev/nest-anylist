import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListModule } from './list/list.module';
import { ListItemModule } from './list-item/list-item.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService:JwtService) => {
        return {
          playground: false,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          context({req}){
            // const token = req.headers.authorization?.replace("Bearer ", "")
            
            // if(!token) throw new Error("Token needed")
            
            // const payload = jwtService.decode(token)
            
            // if(!payload) throw new Error("Token not valid")
          }
        };
      },
    }),
    // TODO: Configuración basica
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    //   plugins: [
    //     ApolloServerPluginLandingPageLocalDefault()
    //   ]
    // }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl: (process.env.STATE === "prod" )
        ? { rejectUnauthorized: false, sslmode: "require" }
        : false as any,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListModule,
    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(){
    console.log("state:", process.env.STATE)
    console.log("host:", process.env.DB_HOST)
    console.log("port:", +process.env.DB_PORT)
    console.log("username:", process.env.DB_USERNAME)
    console.log("password:", process.env.DB_PASSWORD)
    console.log("database:", process.env.DB_NAME)
  }
}

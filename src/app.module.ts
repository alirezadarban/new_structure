import { Module, Logger, CacheModule, CacheInterceptor } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "../config/configuration";
import { APP_INTERCEPTOR } from "@nestjs/core";
import type { RedisClientOptions } from 'redis';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration /* databaseConfig, authConfig */],
      envFilePath: `.env.${process.env.NODE_ENV}`,
      // envFilePath: `.env.dev`,
      cache: true
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,

      // Store-specific configuration:
      socket: {
        host: "localhost",
        port: 6379
      },
      isGlobal: true
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {
}

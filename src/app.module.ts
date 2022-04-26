import { Module, Logger, CacheModule, CacheInterceptor, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "../config/configuration";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import type { RedisClientOptions } from 'redis';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as redisStore from 'cache-manager-redis-store';
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppLoggerMiddleware } from "./appLogger.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getConnectionOptions } from "typeorm";

@Module({
  imports: [
    /*ConfigModule.forRoot({
      load: [configuration /!* databaseConfig, authConfig *!/],
      envFilePath: `.env.${process.env.NODE_ENV}`,
      // envFilePath: `.env.dev`,
      cache: true
    }),*/
    /*CacheModule.register<RedisClientOptions>({
      store: redisStore,

      // Store-specific configuration:
      socket: {
        host: "localhost",
        port: 6379
      },
      isGlobal: true
    }),
    CacheModule.register(),*/
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
    /*{
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }*/
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}

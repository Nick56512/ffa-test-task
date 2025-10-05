import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Request } from '../request/entities/request.entity';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { ConsumerController } from './consumer/consumer.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';
import { ConfigParams, InjectionKeys } from 'src/common/config/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    SequelizeModule.forFeature([Request]),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const redis = redisStore({
          socket: {
            host: configService.get<string>(ConfigParams.REDIS_HOST),
            port: configService.get<string>(ConfigParams.REDIS_PORT),
          },
        });
        return {
          store: () => redis,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [RequestController, ConsumerController],
  providers: [
    RequestService,
    {
      provide: InjectionKeys.ClientProxyRequest,
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>(ConfigParams.AMQP_URL)],
            queue: configService.getOrThrow<string>(ConfigParams.AMQP_QUEUE),
          },
        }),
      inject: [ConfigService],
    },
  ],
})
export class RequestModule {}

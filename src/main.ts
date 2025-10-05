import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ConfigParams } from './common/config/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>(ConfigParams.AMQP_URL) ??
          'amqp://localhost:5672',
      ],
      queue:
        configService.get<string>(ConfigParams.AMQP_QUEUE) ?? 'request_queue',
      queueOptions: { durable: true },
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
  app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Request } from '../request/entities/request.entity';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { ConsumerController } from './consumer/consumer.controller';

@Module({
  imports: [SequelizeModule.forFeature([Request])],
  controllers: [RequestController, ConsumerController],
  providers: [RequestService],
})
export class RequestModule {}

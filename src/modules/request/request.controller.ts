import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create.request.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ConfigParams } from 'src/common/config/config';

@Controller('request')
export class RequestController {
  private clientProxy: ClientProxy;
  constructor(
    private readonly requestService: RequestService,
    private readonly configService: ConfigService,
  ) {
    this.clientProxy = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [configService.getOrThrow<string>(ConfigParams.AMQP_URL)],
        queue: configService.getOrThrow<string>(ConfigParams.AMQP_QUEUE),
      },
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public getAll() {
    return this.requestService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createRequest(@Body() newRequest: CreateRequestDto) {
    const result = await this.requestService.create(newRequest);
    this.clientProxy.emit('update_status', result.id?.toString());
    return result;
  }
}

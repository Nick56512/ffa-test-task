import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { RequestDto } from './dto/request.dto';

@Controller('request')
export class RequestController {
  private clientProxy: ClientProxy;
  constructor(
    private readonly requestService: RequestService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
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
  public async getAll() {
    const cachedJsonItems = await this.cache.get<string>('requests')
    if(cachedJsonItems) {
        const data: RequestDto[] = JSON.parse(cachedJsonItems)
        return data
    }
    const allItems = await this.requestService.findAll()
    const jsonText = JSON.stringify(allItems)
    await this.cache.set('requests', jsonText, 60000)
    return allItems
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createRequest(@Body() newRequest: CreateRequestDto) {
    const result = await this.requestService.create(newRequest);
    this.clientProxy.emit('update_status', result.id?.toString());
    return result;
  }
}

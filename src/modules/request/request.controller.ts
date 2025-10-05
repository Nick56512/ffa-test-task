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
import { ClientProxy } from '@nestjs/microservices';
import { CacheKeys, InjectionKeys } from '../../common/config/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { RequestDto } from './dto/request.dto';
import { RouterConsumerKeys, RouterControllerKeys } from 'src/common/routes/routes';

@Controller(RouterControllerKeys.Request)
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @Inject(InjectionKeys.ClientProxyRequest)
    private readonly clientProxy: ClientProxy,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll() {
    const cachedJsonItems = await this.cache.get<string>(CacheKeys.CacheRequests);
    if (cachedJsonItems) {
      const data: RequestDto[] = JSON.parse(cachedJsonItems);
      return data;
    }
    const allItems = await this.requestService.findAll();
    const jsonText = JSON.stringify(allItems);
    await this.cache.set(CacheKeys.CacheRequests, jsonText, 60000);
    return allItems;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createRequest(@Body() newRequest: CreateRequestDto) {
    const result = await this.requestService.create(newRequest);
    this.clientProxy.emit(RouterConsumerKeys.UpdateStatus, result.id?.toString());
    return result;
  }
}

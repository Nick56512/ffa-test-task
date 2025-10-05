// request/request.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from './entities/request.entity';
import { RequestDto } from './dto/request.dto';
import { CreateRequestDto } from './dto/create.request.dto';

@Injectable()
export class RequestService {
  private readonly logger: Logger;
  constructor(
    @InjectModel(Request)
    private requestModel: typeof Request,
  ) {
    this.logger = new Logger('Request service');
  }

  async create(newRequest: CreateRequestDto): Promise<RequestDto> {
    const request = await this.requestModel.create({
      name: newRequest.name,
    });
    return request;
  }

  async updateStatus(id: number | string, status: string): Promise<void> {
    await this.requestModel.update({ status }, { where: { id } });
    this.logger.log(`Статус заявки ${id} оновлено на: ${status}`);
  }

  async findById(id: number | string): Promise<RequestDto | null> {
    return this.requestModel.findByPk(id);
  }

  async findAll(): Promise<RequestDto[]> {
    return this.requestModel.findAll();
  }
}

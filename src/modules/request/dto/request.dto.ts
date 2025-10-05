import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RequestStatus } from '../entities/request.entity';

export class RequestDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RequestStatus)
  @IsNotEmpty()
  status: RequestStatus;
}

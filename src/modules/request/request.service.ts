import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Request } from "./entities/request.entity";

@Injectable()
export class RequestService {
    constructor(@InjectModel(Request) private readonly requestModel: typeof Request) {}

    
}
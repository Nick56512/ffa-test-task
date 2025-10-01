import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Request } from '../request/entities/request.entity'
import { ReqeustController } from "./request.controller";
import { RequestService } from "./request.service";

@Module({
    imports: [ SequelizeModule.forFeature([Request]) ],
    controllers: [ ReqeustController ],
    providers: [ RequestService ]
})
export class RequestModule {}
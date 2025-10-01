import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigParams } from "src/common/config/config";

@Module({
    imports: [
        SequelizeModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                dialect: 'postgres',
                host: configService.getOrThrow<string>(ConfigParams.DB_HOST),
                port: configService.getOrThrow<number>(ConfigParams.DB_PORT),
                username: configService.getOrThrow<string>(ConfigParams.DB_USER),
                password: configService.getOrThrow<string>(ConfigParams.DB_PASS),
                database: configService.getOrThrow<string>(ConfigParams.DB_NAME),
                autoLoadModels: true
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [],
    providers: []
})
export class DatabaseModule {}

import { Module } from "@nestjs/common";
import { LoadingTimeController } from "./loadingtime.controller";
import { LoadingTimeService } from "./loadingtime.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [LoadingTimeController],
    providers: [LoadingTimeService]
})
export class LoadingTimeModule{

}
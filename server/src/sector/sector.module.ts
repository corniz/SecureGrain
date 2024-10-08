import { Module } from "@nestjs/common";
import { SectorController } from "./sector.controller";
import { SectorService } from "./sector.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [SectorController],
    providers: [SectorService]
})
export class SectorModule{

}
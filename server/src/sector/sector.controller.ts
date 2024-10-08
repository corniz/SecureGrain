import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, HttpException, HttpStatus, ParseIntPipe } from "@nestjs/common";
import { SectorService } from "./sector.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';
import { SectorCreateDto } from "./dto";

@Controller('sectors') // localhost:port/sectors/create
export class SectorController {

    constructor(private sectorService: SectorService) {

    }

    @Post('')
    async createSector(@Body() sectorData: SectorCreateDto) {
        return this.sectorService.Create(sectorData);
    }


    @Get('')
    async getSectors() {
        return this.sectorService.FindSectors();
    }


    @Delete(':id')
    async deleteSector(@Param('id', ParseIntPipe) id: number) {
        
        return this.sectorService.Delete(id);
    }

    @Get('inactive')
    async getInactiveSectors() {
        return this.sectorService.FindInactiveSectors();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/get/:code')
    async getSector(@Param('code', ParseIntPipe) code: number) {
        return this.sectorService.GetSector(code);
    }

    /*
    @Get(':id')
    async getSectorInfo(@Param('id') id: number) {
        return this.sectorService.findOne(id);
    }
    */

}

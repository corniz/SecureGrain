import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards, HttpException, HttpStatus, ParseIntPipe} from "@nestjs/common";
import { LoadingTimeService } from "./loadingtime.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';
import { LoadingTimeCreateDto } from "./dto";

@Controller('loadingtimes')
export class LoadingTimeController {
    constructor(private loadingTimeService: LoadingTimeService){
}

    @Post('')
    async createSector(@Body() loadingTimeData: LoadingTimeCreateDto) {
        console.log(loadingTimeData);
        return this.loadingTimeService.Create(loadingTimeData);
    }


    @Get('')
    async getLoadingTimes(){
        return this.loadingTimeService.FindLoadingTimes();
    }

    @Delete(':id')
    async deleteSector(@Param('id', ParseIntPipe) id: number) {
    return this.loadingTimeService.Delete(id);
    }

    @Get('get/:date/:time')
    async findLoadingTime(@Param('date') date: string, @Param('time') time: number) {
        return this.loadingTimeService.FindLoadingTime(date, Number(time));
    }
}

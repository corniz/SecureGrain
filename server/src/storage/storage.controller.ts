import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards, HttpException, HttpStatus, ParseIntPipe, Patch} from "@nestjs/common";
import { StorageService } from "./storage.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';
import { CreateStorageDto, UpdateStorageDto } from "./dto";

@Controller('storages')
export class StorageController {

    constructor(private storageService: StorageService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('')
    async getAll(@Req() req: Request){
        return this.storageService.getAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteStorage(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.storageService.deleteStorage(id);
            return { message: 'Storage deleted successfully' };
        } catch (error) {
            throw new Error('Failed to delete storage (wrong ID)');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getStorageInfo(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.storageService.getStorage(id);
        } catch (error) {
            throw new Error('Couldnt get storage info by ID');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('')
    async createNewStorage(@Body() dto: CreateStorageDto) {
        try {
            return await this.storageService.createNewStorage(dto);
        } catch (error) {
            throw new Error('Failed to create new storage');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    async updateStorage(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStorageDto) {
        try {
            return await this.storageService.updateStorage(dto, id);
        } catch (error) {
            throw new Error('Failed to create new storage');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/apply-warehouse')
    async applyStorage(@Param('id', ParseIntPipe) id: number, @Body('warehouseId', ParseIntPipe) warehouseId: number) {
        try {
            return await this.storageService.applySector(id, warehouseId);
        } catch (error) {
            throw new Error('Failed to apply sector');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/unapply-warehouse')
    async unapplyStorage(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.storageService.unapplySector(id);
        } catch (error) {
            throw new Error('Failed to apply sector');
        }
    }
}

import {Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { CreateStorageDto, UpdateStorageDto } from './dto';


@Injectable()
export class StorageService {

    constructor(private prisma: PrismaService) {
    }


    async getAll(){
        return this.prisma.warehouse.findMany({
            orderBy: {
              city: 'asc',
            },
          });
    }

    async deleteStorage(id: number) {
      await this.prisma.warehouse.delete({
        where: { id },
      });
    }

    async getStorage(id: number) {
      const storage = await this.prisma.warehouse.findUnique({
        where: { id },
        select: {
          code: true,
          city: true,
          address: true,
          sectors: true
        },
      });
      return storage;
    }

    async createNewStorage(dto: CreateStorageDto){
      try {
        const highestStorageCode = await this.prisma.warehouse.findFirst({
          orderBy: {
            code: 'desc'
          }
        });

        let nextCode = highestStorageCode ? parseInt(highestStorageCode.code) + 1 : 1;
        const paddedCode = nextCode.toString().padStart(4, '0');

        const storage = await this.prisma.warehouse.create({
            data: {
                code: paddedCode,
                city: dto.storageCity,
                address: dto.storageAddress,
            },
        });

        return storage;
      }
      catch(error){
        throw error;
      }
    }

    async updateStorage(dto: UpdateStorageDto, storageId: number) {
      try {
        const { storageCity, storageAddress } = dto;
  
        const updatedStorage = await this.prisma.warehouse.update({
          where: { id: storageId },
          data: {
            city: storageCity,
            address: storageAddress,
          },
        });
  
        return updatedStorage;
      } catch (error) {
        throw error;
      }
    }

  async applySector(id: number, warehouseId: number){
    return this.prisma.sector.update({
      where: { id: id },
      data: { warehouseId: warehouseId, is_working: true },
    });
  }

  async unapplySector(id: number){
    return this.prisma.sector.update({
      where: { id: id },
      data: { warehouseId: null, is_working: false },
    });
  }
}
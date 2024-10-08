import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { SectorCreateDto } from './dto';


@Injectable()
export class SectorService {

  constructor(private prisma: PrismaService) {
  }

  async Create(sectorData: SectorCreateDto) {

    const highestSectorCode = await this.prisma.sector.findFirst({
      orderBy: {
        code: 'desc'
      }
    });

    let nextCode = highestSectorCode ? parseInt(highestSectorCode.code) + 1 : 1;
    const paddedCode = nextCode.toString().padStart(4, '0');

    return this.prisma.sector.create({
      data: {
        max_space: sectorData.maxSpace,
        code: paddedCode,
        day_price: sectorData.sectorPrice,
      },
    });
  }

  async FindSectors() {
    return this.prisma.sector.findMany({
      select: {
        id: true,
        code: true,
        taken_space: true,
        max_space: true,
        is_working: true,
        day_price: true,
      }

    })
  }

  async FindInactiveSectors() {
    return this.prisma.sector.findMany({
      where: { is_working: false },
      select: {
        id: true,
        code: true,
        taken_space: true,
        max_space: true,
        is_working: true,
        day_price: true,
      }

    })
  }

  async Delete(sectorId: number) {

    const sector = await this.prisma.sector.delete({
      where: { id: sectorId }
    });
    return sector;
    
  }

  async GetSector(id: number) {
    const sectors = await this.prisma.sector.findMany({
        where: { warehouseId: id }
    });

    return sectors;
}
}
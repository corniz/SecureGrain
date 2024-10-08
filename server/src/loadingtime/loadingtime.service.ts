import {Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { LoadingTimeCreateDto } from './dto';


@Injectable()
export class LoadingTimeService {

  constructor(private prisma: PrismaService) {
  }

  async Create(loadingTimeData: LoadingTimeCreateDto) {
    return this.prisma.loadingTime.create({
      data: {
        date: loadingTimeData.date,
        time: Number(loadingTimeData.time),
        type: loadingTimeData.type,
        sectorId: Number(loadingTimeData.sectorId)
      },
    });
  }

  async FindLoadingTimes() {
    return this.prisma.loadingTime.findMany({
      select: {
        id: true,
        date: true,
        time: true,
        type: true,
        sector: true
      }
    })
  }

  async Delete(id: number) {
    
    const user = await this.prisma.loadingTime.delete({
      where: { 
        id: id
      }
    })
  return user;
  }

  async FindLoadingTime(date: string, time: number) {
    const loadingTime = await this.prisma.loadingTime.findMany({
      where: { 
        date: date,
        time: time
      }
    })
    return loadingTime;
  }
}
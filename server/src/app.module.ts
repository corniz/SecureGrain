import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { SectorModule } from './sector/sector.module';
import { LoadingTimeModule } from './loadingtime/loadingtime.module';
import { ReservationModule } from './reservation/reservation.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), PrismaModule, AuthModule, UserModule, StorageModule, SectorModule, ReservationModule, LoadingTimeModule, UsersModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}

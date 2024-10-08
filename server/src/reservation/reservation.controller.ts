import { Controller, Req, UseGuards, Get, Param, Post, Body } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthGuard } from "@nestjs/passport";
import { ReservedDatesDto } from "./dto";
import { ReservationCreateDto } from './dto/reservationcreate.dto';
import { UsersService } from 'src/users/users.service';
@Controller('reservations')
export class ReservationController {
    constructor(private reservationService: ReservationService, private usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('')
    async getAll(@Req() req) {
        const userId = req.user.id;
        const user = await this.usersService.findOne1(userId);
        if (user.role == "Manager") {
            const managerReservations = await this.reservationService.getManagerReservations(userId);
                
        return managerReservations
            this.reservationService.getUserReservations(userId);
        }
        else{
            const userReservations = await this.reservationService.getUserReservations(userId);
        
        return  userReservations
        }
    }

    @Get(':sectorId')
    async getReservedDates(@Param('sectorId') sectorId: string): Promise<ReservedDatesDto[]> {
        return this.reservationService.getReservedDates(Number(sectorId));
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async createReservation(@Req() req, @Body() body) {
        const userId = req.user.id;
        return this.reservationService.createReservation(body.endDate, body.startDate, userId, body.sectorId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Post('')
    async createReservation2(@Body() body) {
        const userId = body.userid;
        return this.reservationService.createReservation(body.endDate, body.startDate, userId, body.sectorId);
    }
}

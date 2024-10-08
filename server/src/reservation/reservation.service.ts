import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { ReservedDatesDto } from "./dto";

@Injectable()
export class ReservationService {
    constructor(private prisma: PrismaService) {

    }

    async getUserReservations(userId: number) {
        const reservations = await this.prisma.reservation.findMany({
            where: { userId: userId },
            include: {
                sector: {
                    select: {
                        code: true,
                        max_space: true,
                        taken_space: true,
                    },
                },
            },
        });
        return reservations;
    }

    async getReservedDates(sectorId: number): Promise<ReservedDatesDto[]> {
        const reservations = await this.prisma.reservation.findMany({
            where: {
                sectorId: sectorId,
                state: {
                    in: ['CONFIRMED', 'IN_USE'],
                },
            },
            select: {
                start_date: true,
                end_date: true,
            },
        });

        return reservations.map(reservation => ({
            startDate: reservation.start_date,
            endDate: reservation.end_date,
        }));
    }

    async createReservation(endDate, startDate, userId, sectorId) {
        return this.prisma.reservation.create({
            data: {
                userId: userId,
                end_date: endDate,
                start_date: startDate,
                sectorId: sectorId,
            }
        })
    }

    async getManagerReservations(userId: number) {
        console.log("Getting Reservations for Manager")
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
            include: {
                warehouse: {
                    select: {
                        sectors: {
                            select: {
                                Reservation: true,
                                code: true,
                                max_space: true,
                                taken_space: true
                            }
                        }
                    }
                },
            },
        });

        const reservations = [];
        user.warehouse.sectors.forEach(sector => {
            sector.Reservation.forEach(reservation => {
                reservations.push({
                    id: reservation.id,
                    start_date: reservation.start_date,
                    end_date: reservation.end_date,
                    state: reservation.state,
                    document_url: reservation.document_url,
                    invoice_url: reservation.invoice_url,
                    userId: reservation.userId,
                    sectorId: reservation.sectorId,
                    sector: {
                        taken_space: sector.taken_space,
                        max_space: sector.max_space,
                        code: sector.code,
                    },
                });
            })
        });
        console.log(reservations);
        return reservations;
    }
}

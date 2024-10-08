import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SectorCreateDto {
    @IsNumber()
    maxSpace: number;

    @IsNumber()
    sectorPrice: number;
}
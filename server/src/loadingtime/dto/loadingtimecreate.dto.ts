import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString, isNumber, isString } from "class-validator";

export class LoadingTimeCreateDto {
    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    time: number;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    sectorId: number;
}
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateStorageDto {
    @IsString()
    @IsNotEmpty()
    storageCity: string;

    @IsString()
    @IsNotEmpty()
    storageAddress: string;
}
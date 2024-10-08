import { IsNotEmpty, IsString } from "class-validator";

export class CreateStorageDto {
    @IsString()
    @IsNotEmpty()
    storageCity: string;

    @IsString()
    @IsNotEmpty()
    storageAddress: string;
}
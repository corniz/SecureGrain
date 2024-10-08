import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthLogDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
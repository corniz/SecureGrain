import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, AuthLogDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {

    }

    async signin(dto: AuthLogDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!user){
            throw new ForbiddenException('Incorrect credentials')
        }

        const pwMatches = await argon.verify(user.hash, dto.password)

        if (!pwMatches){
            throw new ForbiddenException('Incorrect credentials')
        }
        return this.signToken(user.id, user.email)
    }

    async signup(dto: AuthDto){
        if(dto.password.length < 5){
            throw new ForbiddenException('Password must be atleast 5 characters')
        }else if(!dto.email.match(/^\S+@\S+\.\S+$/)){
            throw new ForbiddenException('Invalid email address is provided')
        }else if(dto.password != dto.rePassword){
            throw new ForbiddenException('Password do not match')
        }



        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    hash,
                    phoneNumber: dto.phoneNumber,
                },
            });
    
            return this.signToken(user.id, user.email)
        }
        catch(error){
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2002"){
                if (error.message.includes('email')) {
                    throw new ForbiddenException('Email is already taken');
                }
            }
            throw error;
        }
        
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}>{
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '60m',
            secret: secret
        })

        return {
            access_token: token,
        }
    }
}
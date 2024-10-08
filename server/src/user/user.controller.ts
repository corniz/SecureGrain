import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards, HttpException, HttpStatus} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';

@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req: Request) {
        return req.user;
    }
}

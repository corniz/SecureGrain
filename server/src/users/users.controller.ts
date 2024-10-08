import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
  @Get('all')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('')
  async findAllUsers() {
    return await this.usersService.findAllUsers();
  }

  @Get(':id')
  async findOne1(@Param('id') id: string) {
    return await this.usersService.findOne1(parseInt(id));
  }

  //@Put(':id')
  //async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //  return await this.usersService.update(parseInt(id), updateUserDto);
  //}

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body) {
    return await this.usersService.update(parseInt(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(parseInt(id));
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.usersService.remove(parseInt(id));
  }
}

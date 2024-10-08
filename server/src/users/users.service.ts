import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const hashedPassword = await argon2.hash(data.password);
    const userData = { ...data, hash: hashedPassword, password: undefined };
    return await this.prisma.user.create({ data: userData });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findAllUsers() {
    return await this.prisma.user.findMany();
  }

  async findOne1(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id }
  });

  return user;
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    const updateData = { ...data };

    return await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    
    const sector = await  this.prisma.user.delete({ where: { id } });

  return sector;
  }
}

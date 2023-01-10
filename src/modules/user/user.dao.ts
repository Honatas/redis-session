import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from '../global/prisma.service';

@Injectable()
export class UserDao {
  constructor(private prisma: PrismaService) {}

  public async findByUsername(username: string): Promise<Users | null> {
    return this.prisma.users.findUnique({ where: { username } });
  }

  public async createUser(user: Prisma.UsersCreateInput): Promise<Users> {
    return this.prisma.users.create({
      data: user,
    });
  }
}

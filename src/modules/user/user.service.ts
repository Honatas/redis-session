import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserRequest } from './request/create.user.request';
import { UserDao } from './user.dao';

@Injectable()
export class UserService {
  constructor(private userDao: UserDao) {}

  public async create(request: CreateUserRequest): Promise<void> {
    if ((await this.userDao.findByUsername(request.username)) != null) {
      throw new BadRequestException(`Username ${request.username} already exists`);
    }

    const user: Prisma.UsersCreateInput = {
      ...request,
      status: 'A',
      createdAt: new Date(),
    };

    await this.userDao.createUser(user);
  }
}

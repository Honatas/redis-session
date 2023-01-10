import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserRequest } from './request/create.user.request';
import { UserDao } from './user.dao';
import * as bcrypt from 'bcrypt';
import { LoginRequest } from './request/login.request';

@Injectable()
export class UserService {
  constructor(private userDao: UserDao) {}

  public async create(request: CreateUserRequest): Promise<void> {
    if ((await this.userDao.findByUsername(request.username)) != null) {
      throw new BadRequestException(`Username ${request.username} already exists`);
    }

    const user: Prisma.UsersCreateInput = {
      username: request.username,
      password: await bcrypt.hash(request.password, 10),
      createdAt: new Date(),
    };

    await this.userDao.createUser(user);
  }

  public async login(request: LoginRequest): Promise<void> {
    const user = await this.userDao.findByUsername(request.username);
    if (!user) {
      throw new UnauthorizedException('Invalid user/password');
    }

    if (!(await bcrypt.compare(request.password, user.password))) {
      throw new UnauthorizedException('Invalid user/password');
    }
  }
}
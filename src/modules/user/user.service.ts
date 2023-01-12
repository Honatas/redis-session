import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user.dto';
import { CreateUserRequest } from './request/create.user.request';
import { LoginRequest } from './request/login.request';
import { UserDao, UserModel } from './user.dao';

@Injectable()
export class UserService {
  constructor(private userDao: UserDao) {}

  public async create(request: CreateUserRequest): Promise<void> {
    if ((await this.userDao.findByUsername(request.username)) != null) {
      throw new BadRequestException(`Username ${request.username} already exists`);
    }

    const user: Prisma.UserCreateInput = {
      username: request.username,
      password: await bcrypt.hash(request.password, 10),
      createdAt: new Date(),
    };

    await this.userDao.createUser(user);
  }

  public async login(request: LoginRequest): Promise<UserDto> {
    const user = await this.userDao.findByUsername(request.username);
    if (!user) {
      throw new UnauthorizedException('Invalid user/password');
    }

    if (!(await bcrypt.compare(request.password, user.password))) {
      throw new UnauthorizedException('Invalid user/password');
    }

    return this.getUserDto(user);
  }

  private getUserDto(user: UserModel): UserDto {
    const userDto = {
      userId: user.userId,
      username: user.username,
      roles: [] as string[],
    };

    for (const group of user.groups) {
      for (const role of group.group.roles) {
        if (userDto.roles.indexOf(role.role.name) == -1) {
          userDto.roles.push(role.role.name);
        }
      }
    }

    return userDto;
  }
}

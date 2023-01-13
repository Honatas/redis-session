import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user.dto';
import { PrismaService } from '../global/prisma.service';
import { AssignRequest } from './request/assign.request';
import { CreateUserRequest } from './request/create.user.request';
import { LoginRequest } from './request/login.request';
import { UserDao, UserModel } from './user.dao';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private userDao: UserDao) {}

  public async create(request: CreateUserRequest): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existingUser = await this.userDao.findByUsername(tx, request.username);
      if (existingUser != null) {
        throw new BadRequestException(`Username ${request.username} already exists`);
      }
      await this.userDao.createUser(tx, {
        username: request.username,
        password: await bcrypt.hash(request.password, 10),
        createdAt: new Date(),
      });
    });
  }

  public async login(request: LoginRequest): Promise<UserDto> {
    return await this.prisma.$transaction(async (tx) => {
      const user = await this.userDao.findByUsername(tx, request.username);
      if (!user) {
        throw new UnauthorizedException('Invalid user/password');
      }

      if (!(await bcrypt.compare(request.password, user.password))) {
        throw new UnauthorizedException('Invalid user/password');
      }

      return this.getUserDto(user);
    });
  }

  public async assign(request: AssignRequest): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const user = await this.userDao.findById(tx, request.userId);
      if (!user) {
        throw new BadRequestException(`User with id ${request.userId} not found`);
      }
      try {
        await this.userDao.updateGroups(tx, request.userId, request.groupIds);
      } catch (err) {
        // Yup, this is lazy. Gotta improve it.
        throw new BadRequestException('Invalid group list');
      }
    });
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

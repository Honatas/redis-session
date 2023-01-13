import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user.dto';
import { PrismaService } from '../global/prisma.service';
import { AssignRequest } from './request/assign.request';
import { CreateUserRequest } from './request/create.user.request';
import { LoginRequest } from './request/login.request';

type UserModel = Prisma.UserGetPayload<{
  include: {
    groups: {
      include: {
        group: {
          include: {
            roles: {
              include: {
                role: true;
              };
            };
          };
        };
      };
    };
  };
}>;

@Injectable()
export class UserService {
  private userRelations = {
    groups: {
      include: {
        group: {
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    },
  };

  constructor(private prisma: PrismaService) {}

  public async create(request: CreateUserRequest): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { username: request.username },
        include: this.userRelations,
      });
      if (existingUser != null) {
        throw new BadRequestException(`Username ${request.username} already exists`);
      }

      await tx.user.create({
        data: {
          username: request.username,
          password: await bcrypt.hash(request.password, 10),
          createdAt: new Date(),
        },
      });
    });
  }

  public async login(request: LoginRequest): Promise<UserDto> {
    return await this.prisma.$transaction(async (tx) => {
      const user = await this.prisma.user.findUnique({
        where: { username: request.username },
        include: this.userRelations,
      });
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
      const user = await this.prisma.user.findUnique({
        where: { userId: request.userId },
        include: this.userRelations,
      });
      if (!user) {
        throw new BadRequestException(`User with id ${request.userId} not found`);
      }

      const data = request.groupIds.map((groupId) => {
        return { userId: user.userId, groupId };
      });
      await tx.usersOnGroups.deleteMany({ where: { userId: user.userId } });
      try {
        await tx.usersOnGroups.createMany({ data });
      } catch (err) {
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

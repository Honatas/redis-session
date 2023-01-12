import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/modules/global/prisma.service';

export type UserModel = Prisma.UserGetPayload<{
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
export class UserDao {
  constructor(private prisma: PrismaService) {}

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

  public async findById(userId: number): Promise<UserModel | null> {
    return this.prisma.user.findUnique({
      where: { userId },
      include: this.userRelations,
    });
  }

  public async findByUsername(username: string): Promise<UserModel | null> {
    return this.prisma.user.findUnique({
      where: { username },
      include: this.userRelations,
    });
  }

  public async createUser(user: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: user,
    });
  }
}

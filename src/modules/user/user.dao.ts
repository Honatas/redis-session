import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

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

  public async findById(tx: Prisma.TransactionClient, userId: number): Promise<UserModel | null> {
    return tx.user.findUnique({
      where: { userId },
      include: this.userRelations,
    });
  }

  public async findByUsername(tx: Prisma.TransactionClient, username: string): Promise<UserModel | null> {
    return tx.user.findUnique({
      where: { username },
      include: this.userRelations,
    });
  }

  public async createUser(tx: Prisma.TransactionClient, user: Prisma.UserCreateInput): Promise<User> {
    return tx.user.create({
      data: user,
    });
  }

  public async updateGroups(tx: Prisma.TransactionClient, userId: number, groupIds: number[]): Promise<void> {
    const data = groupIds.map((groupId) => {
      return { userId, groupId };
    });
    await tx.usersOnGroups.deleteMany({ where: { userId } });
    await tx.usersOnGroups.createMany({ data });
  }
}

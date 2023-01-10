import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      updatedAt: new Date(),
    },
    create: {
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      createdAt: new Date(),
      groups: {
        create: [
          {
            group: {
              create: {
                name: 'Admin',
                roles: {
                  create: [
                    {
                      role: {
                        create: {
                          name: 'CREATE_ROLE',
                          description: 'User can create new roles',
                        },
                      },
                    },
                    {
                      role: {
                        create: {
                          name: 'CREATE_GROUP',
                          description: 'User can create new groups',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          {
            group: {
              create: {
                name: 'Manager',
                roles: {
                  create: [
                    {
                      role: {
                        create: {
                          name: 'ASSIGN_USERS',
                          description: 'User can assign groups to users',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

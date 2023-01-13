import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private static readonly LOGGER = new Logger(PrismaService.name);

  async onModuleInit() {
    PrismaService.LOGGER.log('Connecting Prisma client ...');
    await this.$connect();
    PrismaService.LOGGER.log('Prisma client connected to the database.');
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      console.log('Closing Prisma client');
      await app.close();
    });
  }
}

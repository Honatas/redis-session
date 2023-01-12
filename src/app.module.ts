import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserModule } from './modules/user/user.module';
import { GlobalModule } from './modules/global/global.module';
import { RolesGuard } from './middleware/roles.guard';

@Module({
  imports: [GlobalModule, UserModule],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

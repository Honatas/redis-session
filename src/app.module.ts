import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserModule } from './modules/rest/user/user.module';
import { GlobalModule } from './modules/global/global.module';

@Module({
  imports: [GlobalModule, UserModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

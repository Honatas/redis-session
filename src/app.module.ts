import { Module } from '@nestjs/common';
import { RolesGuard } from './middleware/roles.guard';
import { GlobalModule } from './modules/global/global.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [GlobalModule, UserModule],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import { default as Redis } from 'ioredis';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './middleware/logging.interceptor';

async function bootstrap() {
  let RedisStore = connectRedis(session);
  const redisClient = new Redis();

  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: 'keyboard cat',
      resave: false,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Auth')
    .setDescription('Auth API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();

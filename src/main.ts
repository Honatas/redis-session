import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import { default as Redis } from 'ioredis';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './middleware/logging.interceptor';

class Main {
  async bootstrap() {
    const logger = new Logger(Main.name);
    const RedisStore = connectRedis(session);
    const redisClient = new Redis();
    const port = 3000;

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

    logger.log(`Listening on port ${port}`);
    await app.listen(port);
  }
}

new Main().bootstrap();

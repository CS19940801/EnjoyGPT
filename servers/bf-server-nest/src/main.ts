import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { CorsMiddleware } from '@nestjs/common/middleware/cors.middleware';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(2999);
}
bootstrap();

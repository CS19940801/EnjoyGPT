import { NestFactory } from '@nestjs/core'; // 核心模块
import { AppModule } from './app.module'; // 根模块
// import { CorsMiddleware } from '@nestjs/common/middleware/cors.middleware';


async function bootstrap() { // 基础服务配置
  const app = await NestFactory.create(AppModule, { cors: true }); // 创建服务，可以跨域
  await app.listen(2999); // 服务端口号
}
bootstrap(); // 启动服务

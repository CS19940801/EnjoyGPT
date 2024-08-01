import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GptController } from './gpt.controller';
import { AppService } from './app.service';

@Module({
  imports: [], // 倒入模块
  controllers: [AppController, GptController], // 所需控制器
  providers: [AppService], // 所需服务
  // exports:[] // 导出服务
})
export class AppModule {}

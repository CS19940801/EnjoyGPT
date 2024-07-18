import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GptController } from './gpt.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, GptController],
  providers: [AppService],
})
export class AppModule {}

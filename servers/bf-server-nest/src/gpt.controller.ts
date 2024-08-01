import { Controller, Post, Body, Sse, Header } from '@nestjs/common'; // 引入nestjs的controller等核心功能
import { Observable, Subject } from 'rxjs';  // 引入rxjs的Observable（流）和Subject
import { Ollama } from '@langchain/community/llms/ollama'; // langchain Ollama 模型接入

@Controller() // 装饰器
export class GptController {
  private messageSubject = new Subject<MessageEvent>();
  private model: Ollama;
  constructor() {
    this.model = new Ollama({
      baseUrl: 'http://localhost:11434',
      model: 'llama3',
    });
  }
  @Sse('sse') // sse 接口
  @Header('Content-Type', 'text/event-stream')
  sse(): Observable<MessageEvent> { // 返回流
    return this.messageSubject.asObservable();
  }
  @Post('question') // question 接口
  async addList(@Body() body: { question: string }): Promise<any> {
    const stream = await this.model.stream(body.question);
    for await (const str of stream) {
      this.messageSubject.next({
        data: JSON.stringify({ answer: str, end: false }),
      } as MessageEvent);
    }
    this.messageSubject.next({
      data: JSON.stringify({ answer: '', end: true }),
    } as MessageEvent);
  }
}

import { Controller, Post, Body, Sse, Header } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { Ollama } from '@langchain/community/llms/ollama';

@Controller()
export class GptController {
  private messageSubject = new Subject<MessageEvent>();
  private model: Ollama;
  constructor() {
    this.model = new Ollama({
      baseUrl: 'http://localhost:11434',
      model: 'llama3',
    });
  }
  @Sse('sse')
  @Header('Content-Type', 'text/event-stream')
  sse(): Observable<MessageEvent> {
    return this.messageSubject.asObservable();
  }
  @Post('question')
  async addList(@Body() body: { question: string }): Promise<any> {
    const stream = await this.model.stream(body.question);
    for await (const str of stream) {
      this.messageSubject.next({
        data: JSON.stringify({ answer: str, end: false }),
      } as MessageEvent);
      // Å
    }
    this.messageSubject.next({
      data: JSON.stringify({ answer: '', end: true }),
    } as MessageEvent);
  }
}

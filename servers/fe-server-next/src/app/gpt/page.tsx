'use client'
import { useRef, useState, useEffect } from "react";
import { Input, Button, Card } from "antd";
import "./gpt.css";

type Message = {
    answer: string;
    last: string;
    end: boolean;
};
const { TextArea } = Input;
export default function Layout() {
        // let message: any, setMessage: any, question: any, setQuestion: any;
        const [message, setMessage] = useState<Message[]>([]);
        const [question, setQuestion] = useState<string>("");
        const qText = useRef<any>();
        // useEffect(() => {
            const send = () => {
                const question = qText.current.resizableTextArea.textArea.value as string;// 获取输入框内容
                if (!question) return;
                fetch("http://127.0.0.1:2999/question", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        question,
                    }),
                });
                setQuestion(question);
                qText.current.resizableTextArea.textArea.value = "";// 重制输入框
                setMessage((prev) => [...prev, { answer: "", end: false,last:''}]);
                const eventSource = new EventSource("http://localhost:2999/sse");// 开启sse
                let mesCount = 0;
                eventSource.onmessage = ({ data }) => {
                    const { answer, end } = JSON.parse(data);
                    if (!end) {
                        setMessage((prev) => {
                            const newMessages = [...prev];
                            mesCount++
                            // console.log(`mesCount`, mesCount);
                            // console.log(`answer`, answer);
                            // console.log(`newMessages.last`, newMessages[newMessages.length - 1].last, answer != newMessages[newMessages.length - 1].last)
                            if(answer != newMessages[newMessages.length - 1].last){
                                newMessages[newMessages.length - 1].last = answer
                                console.log(`newMessages.answer`, newMessages[newMessages.length - 1].answer)
                                newMessages[newMessages.length - 1].answer += answer;
                            }
                            return newMessages;
                        });
                    }
                    if (end) {
                        eventSource.close();
                    }
                };
            };
    
    
    return (
        <div style={{margin:'20px'}}>
            <nav style={{ margin: '0 0 20px 0' }}>
                <p style={{ margin: '0 auto', textAlign: 'center', marginBottom: '10px', }}>
                    <img style={{height:'150px'}} src="https://ollama.com/public/ollama.png" className="w-full h-full" />
                </p>
                <p style={{ textAlign: 'center',marginBottom:'20px',fontSize:'h1'}}>EnjoyGpt-llama3</p>
            </nav>
            <div className="w-full h-[calc(100%-64px)] relative">
                <main className="w-full h-full absolute left-[200px] top-0 px-2">
                    <div className="w-full h-[calc(100%-64px)] py-4 overflow-y-auto">
                        <Card style={{ display: question ? "block" : "none", width: 300, margin: '0 0 20px 0', }}>
                            <p>Q:{question}</p>
                        </Card>
                        <Card style={{ display: message?.[message.length - 1]?.answer ? "block" : "none", width: 1000, margin: '0 0 20px 0', }}>
                            <p>A:{message?.[message.length - 1]?.answer}</p>
                        </Card>
                    </div>
                    <footer style={{display:'flex',}}>
                        <TextArea
                            ref={qText}
                            showCount
                            maxLength={100}
                            placeholder="输你想问"
                            onPressEnter={() => send()}
                        />
                        <Button style={{height:'52px',lineHeight:'52px'}} onClick={() => send()} type="primary">发送</Button>
                    </footer>
                </main>
            </div>
        </div>
    );
}
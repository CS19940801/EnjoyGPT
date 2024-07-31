'use client'

import { useRef, useState, useEffect } from "react";
import { Input, Button, Card } from "antd";
import "./gpt.css";

type Message = {
    answer: string;
    end: boolean;
};
const { TextArea } = Input;
export default function Layout() {
        // let message: any, setMessage: any, question: any, setQuestion: any;
        const [message, setMessage] = useState<Message[]>([]);
        const [question, setQuestion] = useState<string>("");
        // const ref = useRef<any>();
        const qText = useRef<any>();
        console.log(1111, 2222);
        // useEffect(() => {
            const send = () => {
                // 获取输入框内容
                // const question = ref.current.value as string;
                const question = qText.current.resizableTextArea.textArea.value as string;
                console.log('====================================');
                console.log(`question: ${question}`);
                console.log('====================================');
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
                // 重制输入框
                // ref.current.value = "";
                console.log(22222, qText.current);
                qText.current.resizableTextArea.textArea.value = "";
                setMessage((prev) => [...prev, { answer: "", end: false }]);
                const eventSource = new EventSource("http://localhost:2999/sse");
                let mesCount = 0;
                eventSource.onmessage = ({ data }) => {
                    const { answer, end } = JSON.parse(data);
                    if (!end) {
                        setMessage((prev) => {
                            const newMessages = [...prev];
                            console.log(`newMessages`, newMessages, newMessages.length);
                            mesCount++
                            console.log(`mesCount`, mesCount);
                            newMessages[newMessages.length - 1].answer += answer;
                            return newMessages;
                        });
                    }
                    if (end) {
                        eventSource.close();
                    }
                };
            };
        // }, []);
    
    
    return (
        <div style={{margin:'20px'}}>
            <nav className="w-full h-16 flex items-center justify-between bg-indigo-400 px-4">
                <span className="w-10 h-10">
                    <img src="https://ollama.com/public/ollama.png" className="w-full h-full" />
                </span>
                <span>EnjoyGpt-llama3</span>
                {/* <span className="">欢迎使用</span> */}
            </nav>
            <div className="w-full h-[calc(100%-64px)] relative">
                {/* <aside className="w-[200px] bg-red-400 h-full p-4 absolute top-0 flex justify-center">
                    todo
                </aside> */}
                <main className="w-full h-full absolute left-[200px] top-0 px-2">
                    <div className="w-full h-[calc(100%-64px)] py-4 overflow-y-auto">
                        {/* <div
                            style={{
                                display: question ? "block" : "none",
                            }}
                            className="human min-h-[100px] w-[calc(100%-200px)] p-4 rounded-lg text-white bg-yellow-300"
                        >
                            {question}
                        </div> */}
                        <Card style={{ display: question ? "block" : "none", width: 300, 'margin-bottom': '20px', }}>
                            <p>{question}</p>
                        </Card>
                        {/* <div
                            style={{
                                display: message?.[message.length - 1]?.answer
                                    ? "block"
                                    : "none",
                            }}
                            className="ai min-h-[100px] text-white w-[calc(100%-200px)] bg-indigo-500 mt-5 rounded-lg p-4 "
                        >
                            {message?.[message.length - 1]?.answer}
                        </div> */}
                        <Card style={{ display: message?.[message.length - 1]?.answer ? "block" : "none", width: 1000, 'margin-bottom': '20px', }}>
                            <p>{message?.[message.length - 1]?.answer}</p>
                        </Card>
                    </div>
                    <footer className="rounded-lg relative bottom-2 w-[calc(100%-200px)] h-[64px] border-red-300 border-solid border-[1px]">
                        {/* <input
                            ref={ref}
                            type="text"
                            className="rounded-lg w-full px-4 text-lg h-full caret-red-300 outline-none focus:border-[1px] focus:border-solid focus:border-red-500"
                        /> */}
                        {/* <button
                            onClick={() => send()}
                            className="z-10 focus:text-red-700 absolute right-0 top-0 w-[64px] h-[62px] bg-red-300"
                        >
                            发送
                        </button> */}
                        <TextArea
                            ref={qText}
                            showCount
                            maxLength={100}
                            placeholder="disable resize"
                            onPressEnter={() => send()}
                        />
                        <Button onClick={() => send()} type="primary">发送</Button>
                    </footer>
                </main>
            </div>
        </div>
    );
}
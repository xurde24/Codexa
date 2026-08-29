import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatAi({problem, userCode, userLanguage}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi! I am CodeForge AI. How can I help you with this problem?"}]}
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const onSubmit = async (data) => {
        // 1. Create the new array first (fixes the state bug)
        const newMessages = [...messages, { role: 'user', parts:[{text: data.message}] }];
        setMessages(newMessages);
        reset();
        setIsLoading(true);

        try {
            // 2. Send the newly updated array
            const response = await axiosClient.post("/ai/chat", {
                messages: newMessages,
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode,
                userCode,
                userLanguage
            });
           
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Sorry, I encountered an error while processing your request. Please try again."}]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent border-l border-[var(--color-brand-border)] min-h-[500px]">
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-surface)] flex items-center gap-2">
                <Bot className="text-[var(--color-brand-orange)]" size={24} />
                <h3 className="font-semibold text-[var(--color-brand-text-primary)]">AI Assistant</h3>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            msg.role === "user" ? "bg-[var(--color-brand-orange)]/20 text-[var(--color-brand-orange)]" : "bg-blue-500/20 text-blue-400"
                        }`}>
                            {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        {/* Message Bubble */}
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 overflow-x-auto ${
                            msg.role === "user" 
                                ? "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-text-primary)] border border-[var(--color-brand-orange)]/20" 
                                : "bg-[var(--color-brand-surface)] text-[var(--color-brand-text-secondary)] border border-[var(--color-brand-border)]"
                        }`}>
                            {msg.role === "user" ? (
                                <p className="whitespace-pre-wrap text-sm">{msg.parts[0].text}</p>
                            ) : (
                                <div className="text-sm prose prose-invert prose-p:leading-relaxed prose-pre:bg-[var(--color-brand-dark)] prose-pre:border prose-pre:border-[var(--color-brand-border)] prose-pre:rounded-lg max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.parts[0].text}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex gap-3 flex-row">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-500/20 text-blue-400">
                            <Bot size={16} />
                        </div>
                        <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-[var(--color-brand-text-secondary)]" />
                            <span className="text-sm text-[var(--color-brand-text-secondary)]">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[var(--color-brand-surface)] border-t border-[var(--color-brand-border)]">
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex items-center gap-2"
                >
                    <input 
                        placeholder="Ask for hints, explanations, or code review..." 
                        className="flex-1 bg-[var(--color-brand-dark)] text-[var(--color-brand-text-primary)] border border-[var(--color-brand-border)] hover:border-[var(--color-brand-orange)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)]/20 rounded-xl py-3 px-4 text-sm transition-all" 
                        disabled={isLoading}
                        autoComplete="off"
                        {...register("message", { required: true, minLength: 1 })}
                    />
                    <button 
                        type="submit" 
                        className="p-3 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-[#110F0D] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={errors.message || isLoading}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatAi;
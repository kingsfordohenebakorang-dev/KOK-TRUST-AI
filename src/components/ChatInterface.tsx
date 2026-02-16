"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bot, User, Send, ChevronRight, X, Maximize2, Minimize2, MoreHorizontal } from 'lucide-react';
import { MathBlock } from '@/components/MathBlock';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    steps?: { id: string; latex: string; explanation: string }[];
    final_answer?: string;
    citations?: { source: string; page: number; confidence: number }[];
}

export function ChatInterface() {
    const [messages, setMessages] = useState<ChatMessage[]>([{
        id: '1',
        role: 'assistant',
        content: "Hello! I'm ActuarialGPT. Upload your notes, or ask me to solve a problem (e.g., 'Calculate the variance of a deferred annuity')."
    }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content })
            });
            const data = await res.json();

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.content,
                steps: data.steps,
                final_answer: data.final_answer,
                citations: data.citations
            }]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/20 backdrop-blur-xl border-r border-white/5 relative overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <Bot className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm text-gray-200">ActuarialGPT</h2>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Online
                        </span>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn("flex gap-4 max-w-3xl", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                msg.role === 'assistant'
                                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                    : "bg-gray-700/50 border-gray-600 text-gray-300"
                            )}>
                                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>

                            <div className={cn(
                                "rounded-2xl p-4 text-sm leading-relaxed shadow-lg max-w-[85%]",
                                msg.role === 'assistant'
                                    ? "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none"
                                    : "bg-indigo-600 text-white rounded-tr-none"
                            )}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>

                                {/* Steps Rendering */}
                                {msg.steps && (
                                    <div className="mt-4 space-y-3 pl-3 border-l-2 border-indigo-500/30">
                                        {msg.steps.map((step, idx) => (
                                            <div key={idx} className="bg-black/20 rounded-lg p-3">
                                                <p className="text-xs text-indigo-300 font-mono mb-1">Step {step.id}</p>
                                                <p className="text-gray-400 text-xs mb-2">{step.explanation}</p>
                                                <MathBlock latex={step.latex} block className="text-sm" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Final Answer */}
                                {msg.final_answer && (
                                    <div className="mt-4 pt-3 border-t border-white/10">
                                        <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Final Answer</p>
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                                            <MathBlock latex={msg.final_answer} block className="text-lg text-white" />
                                        </div>
                                    </div>
                                )}

                                {/* Citations */}
                                {msg.citations && (
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        {msg.citations.map((cit, i) => (
                                            <button key={i} className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 px-2 py-1 rounded-full transition-colors truncate max-w-[150px]">
                                                📚 {cit.source} (p.{cit.page})
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                            <Bot className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 rounded-tl-none flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your notes..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-lg text-white transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

"use client"

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ChatInterface } from '@/components/ChatInterface';
import { motion } from 'framer-motion';

export default function ChatPage() {
    return (
        <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
            <Navbar />

            <main className="flex-1 pt-16 flex relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
                </div>

                <div className="z-10 w-full max-w-5xl mx-auto h-full p-4 md:p-6 flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex items-center justify-between"
                    >
                        <div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                                Expert Actuarial Tutor
                            </h1>
                            <p className="text-xs text-gray-400">
                                Specialized in SOA/IFoA Exam Prep & Mathematical Reasoning.
                            </p>
                        </div>
                    </motion.div>

                    <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl relative">
                        <ChatInterface mode="tutor" />
                    </div>
                </div>
            </main>
        </div>
    );
}

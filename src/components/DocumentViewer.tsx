"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FileText, Search, Maximize2, Minimize2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Upload } from 'lucide-react';

interface DocumentViewerProps {
    fileUrl?: string; // Optional mocked URL
    fileName?: string;
    currentPage?: number;
    totalParams?: number;
}

export function DocumentViewer({ fileUrl, fileName = "No Document Selected", currentPage = 1 }: DocumentViewerProps) {
    const [page, setPage] = useState(currentPage);
    const [scale, setScale] = useState(1);

    // Mock Content for "Cinematic" visual
    const mockContent = [
        "ACTUARIAL MATHEMATICS FOR LIFE CONTINGENCIES",
        "CHAPTER 3: SURVIVAL MODELS",
        "--------------------------------------------------",
        "3.1 The Future Lifetime Random Variable",
        "",
        "Let (x) denote a life aged x.",
        "The future lifetime of (x) is denoted by T_x.",
        "",
        "$$ S_x(t) = P(T_x > t) $$",
        "",
        "The cumulative distribution function is:",
        "$$ F_x(t) = P(T_x <= t) = 1 - S_x(t) = {}_tq_x $$",
        "",
        "Note: The force of mortality is defined as:",
        "$$ \\mu_{x+t} = - \\frac{S'_x(t)}{S_x(t)} $$",
        "",
        "[ PAGE 1 ]"
    ];

    return (
        <div className="flex flex-col h-full bg-[#1a1a1e] border-l border-white/5 relative">
            {/* Toolbar */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
                <div className="flex items-center gap-3 truncate max-w-[200px]">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
                        <FileText className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="font-semibold text-sm text-gray-200 truncate">{fileName}</span>
                </div>

                <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/5">
                    <button onClick={() => setPage(Math.max(1, page - 1))} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono w-16 text-center text-gray-400">
                        Page {page} / 42
                    </span>
                    <button onClick={() => setPage(page + 1)} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <Search className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Viewer Canvas */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#0f0f12]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[700px] aspect-[1/1.414] bg-white text-black shadow-2xl p-12 font-serif text-sm leading-relaxed relative"
                >
                    {/* Mock Page Content */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0" />

                    <div className="space-y-6">
                        {mockContent.map((line, i) => (
                            <p key={i} className={cn(
                                "min-h-[1em]",
                                line.startsWith("CHAPTER") ? "text-2xl font-bold mb-8" : "",
                                line.startsWith("$$") ? "font-mono bg-gray-100 p-4 border-l-4 border-black/10 text-center my-4" : ""
                            )}>
                                {line}
                            </p>
                        ))}
                    </div>

                    {/* Highlight Simulation */}
                    <motion.div
                        className="absolute top-[35%] left-[10%] right-[10%] h-[60px] bg-yellow-300/30 mix-blend-multiply border-b-2 border-yellow-500 pointer-events-none"
                        initial={{ opacity: 0, width: '0%' }}
                        animate={{ opacity: 1, width: '80%' }}
                        transition={{ delay: 1, duration: 0.5 }}
                    />
                    <div className="absolute -right-16 top-[37%] bg-black text-white text-xs px-2 py-1 rounded shadow-lg flex items-center gap-1">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                        Cited
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

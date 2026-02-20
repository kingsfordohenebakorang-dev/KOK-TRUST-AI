"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { FileText, Upload, Sliders, Zap, CheckCircle2, AlertCircle, Clock, Lock, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_SYLLABUS } from '@/lib/syllabus';
import { MathBlock } from '@/components/MathBlock';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function ExamEnginePage() {
    // Workflow States: 'upload' -> 'generate' -> 'exam' -> 'review'
    const [phase, setPhase] = useState<'upload' | 'generate' | 'exam' | 'review'>('upload');

    // Upload State
    const [materialsUploaded, setMaterialsUploaded] = useState(false);
    const [pastExamsUploaded, setPastExamsUploaded] = useState(false);

    // Exam Config
    const [difficulty, setDifficulty] = useState(50);
    const [duration, setDuration] = useState(10); // Seconds for demo (usually minutes)

    // Live Exam State
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQuestion, setGeneratedQuestion] = useState<any>(null);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (phase === 'exam' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (phase === 'exam' && timeLeft === 0) {
            setPhase('review');
        }
        return () => clearInterval(interval);
    }, [phase, timeLeft]);

    const handleUpload = (type: 'materials' | 'exams') => {
        // Simulate processing
        setTimeout(() => {
            if (type === 'materials') setMaterialsUploaded(true);
            if (type === 'exams') setPastExamsUploaded(true);
        }, 800);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        console.log("Exam generation started...");
        await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate complex analysis

        setGeneratedQuestion({
            id: 'q1',
            text: "Derive the variance of the present value random variable for a **whole life insurance** benefit of 1 payable at the moment of death, assuming a constant force of interest $\\delta$ and constant force of mortality $\\mu$.",
            marks: 10,
            solution: "1. Let $Z = v^{T_x} = e^{-\\delta T_x}$.\n2. The first moment is $E[Z] = \\bar{A}_x = \\frac{\\mu}{\\mu+\\delta}$.\n3. The second moment is $E[Z^2] = E[e^{-2\\delta T_x}] = {}^2\\bar{A}_x = \\frac{\\mu}{\\mu+2\\delta}$.\n4. Thus, $Var(Z) = {}^2\\bar{A}_x - (\\bar{A}_x)^2 = \\frac{\\mu}{\\mu+2\\delta} - \\left(\\frac{\\mu}{\\mu+\\delta}\\right)^2$.",
            marking_scheme: [
                { step: "Define PV Random Variable Z", marks: 2 },
                { step: "Calculate E[Z] (First Moment)", marks: 3 },
                { step: "Calculate E[Z^2] (Second Moment)", marks: 3 },
                { step: "Apply Variance Formula", marks: 2 }
            ]
        });

        setTimeLeft(15); // Reset timer for the question (demo: 15s)
        setIsGenerating(false);
        setPhase('exam');
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            <Navbar />

            <main className="pt-24 px-6 md:px-12 max-w-5xl mx-auto pb-20">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        Exam Intelligence Engine
                    </h1>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                        <div className={cn("flex items-center gap-2", phase === 'upload' ? "text-white font-bold" : "text-green-500")}>
                            <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">1</div>
                            Ingest Data
                        </div>
                        <div className="w-8 h-[1px] bg-white/10" />
                        <div className={cn("flex items-center gap-2", phase === 'generate' ? "text-white font-bold" : phase === 'upload' ? "opacity-50" : "text-green-500")}>
                            <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">2</div>
                            Configure
                        </div>
                        <div className="w-8 h-[1px] bg-white/10" />
                        <div className={cn("flex items-center gap-2", phase === 'exam' || phase === 'review' ? "text-white font-bold" : "opacity-50")}>
                            <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">3</div>
                            Exam Mode
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* PHASE 1: UPLOAD */}
                    {phase === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <div
                                onClick={() => handleUpload('materials')}
                                className={cn(
                                    "border border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all group relative overflow-hidden",
                                    materialsUploaded ? "border-green-500/50 bg-green-500/5" : "border-white/20 hover:border-indigo-500/50 hover:bg-white/5"
                                )}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {materialsUploaded ? (
                                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                ) : (
                                    <FileUp className="w-12 h-12 text-gray-500 group-hover:text-indigo-400 mx-auto mb-4 transition-colors" />
                                )}
                                <h3 className="text-lg font-bold text-gray-200">Lecture Slides</h3>
                                <p className="text-sm text-gray-500 mt-2">Upload PDFs or PPTs to define the syllabus.</p>
                                {materialsUploaded && <p className="text-xs text-green-400 mt-4 font-mono">Analyzed 12 topics</p>}
                            </div>

                            <div
                                onClick={() => handleUpload('exams')}
                                className={cn(
                                    "border border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all group relative overflow-hidden",
                                    pastExamsUploaded ? "border-green-500/50 bg-green-500/5" : "border-white/20 hover:border-purple-500/50 hover:bg-white/5"
                                )}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {pastExamsUploaded ? (
                                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                ) : (
                                    <FileText className="w-12 h-12 text-gray-500 group-hover:text-purple-400 mx-auto mb-4 transition-colors" />
                                )}
                                <h3 className="text-lg font-bold text-gray-200">Past Questions</h3>
                                <p className="text-sm text-gray-500 mt-2">Upload old exams to learn the style and format.</p>
                                {pastExamsUploaded && <p className="text-xs text-green-400 mt-4 font-mono">Profiled 3 exam years</p>}
                            </div>

                            <button
                                disabled={!materialsUploaded || !pastExamsUploaded}
                                onClick={() => setPhase('generate')}
                                className="md:col-span-2 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-white transition-all mt-4"
                            >
                                Continue to Generator
                            </button>
                        </motion.div>
                    )}

                    {/* PHASE 2: CONFIGURE */}
                    {phase === 'generate' && (
                        <motion.div
                            key="generate"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-2xl mx-auto space-y-8"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Sliders className="w-5 h-5 text-indigo-400" /> Exam Configuration
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-3">Predicted Difficulty</label>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                                            <span>Easier</span>
                                            <span>Adaptive (Rec.)</span>
                                            <span>Harder</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400 block mb-3">Topic Focus</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {MOCK_SYLLABUS.slice(0, 3).map(t => (
                                                <button key={t.id} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs">
                                                    {t.title}
                                                </button>
                                            ))}
                                            <button className="px-3 py-1 bg-white/5 text-gray-400 border border-white/10 rounded-full text-xs hover:bg-white/10">+ Add</button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Analyzing Patterns...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5 fill-white" /> Create New Question
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* PHASE 3 & 4: EXAM & REVIEW */}
                    {(phase === 'exam' || phase === 'review') && generatedQuestion && (
                        <motion.div
                            key="exam"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white text-black rounded-2xl shadow-2xl overflow-hidden font-serif relative min-h-[600px] flex flex-col"
                        >
                            {/* Toolbar */}
                            <div className="bg-gray-100 border-b border-gray-200 p-4 flex justify-between items-center font-sans">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Clock className={cn("w-4 h-4", timeLeft < 10 && phase === 'exam' ? "text-red-500 animate-pulse" : "text-gray-500")} />
                                    {phase === 'exam' ? (
                                        <span>Time Remaining: <span className="font-mono">{formatTime(timeLeft)}</span></span>
                                    ) : (
                                        <span className="text-red-600">Time Expired</span>
                                    )}
                                </div>

                                {phase === 'exam' && (
                                    <button
                                        onClick={() => setPhase('review')}
                                        className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors"
                                    >
                                        Submit Early
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-12 flex-1 relative">
                                {/* Watermark */}
                                <div className="absolute inset-0 bg-[#fdfbf7] opacity-50 pointer-events-none mix-blend-multiply" />

                                <div className="relative z-10 max-w-3xl mx-auto">
                                    <div className="flex justify-between items-start border-b-2 border-black/10 pb-6 mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Actuarial Mathematics II</h2>
                                            <p className="text-sm text-gray-600 font-sans mt-1">Generated based on "Midterm_2024.pdf"</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-sans text-gray-500 uppercase tracking-widest">Question 1</p>
                                            <div className="text-3xl font-bold text-gray-900 font-sans">{generatedQuestion.marks}</div>
                                        </div>
                                    </div>

                                    <div className="text-lg leading-relaxed mb-12 prose prose-lg text-gray-800">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {generatedQuestion.text}
                                        </ReactMarkdown>
                                    </div>

                                    {/* SOLUTION SECTION - HIDDEN UNTIL REVIEW */}
                                    <AnimatePresence>
                                        {phase === 'review' ? (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="bg-green-50 border border-green-200 rounded-xl p-6 font-sans overflow-hidden"
                                            >
                                                <h4 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Marking Scheme & Solution
                                                </h4>

                                                <div className="space-y-4 mb-6">
                                                    {generatedQuestion.marking_scheme.map((item: any, i: number) => (
                                                        <div key={i} className="flex items-center justify-between border-b border-green-200 pb-2 last:border-0 last:pb-0">
                                                            <span className="text-sm text-gray-700">{item.step}</span>
                                                            <span className="text-sm font-bold text-green-700 bg-white px-2 py-1 rounded border border-green-100">
                                                                {item.marks}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="text-sm text-gray-800 font-mono bg-white p-4 rounded border border-green-200">
                                                    <MathBlock latex={generatedQuestion.solution} block />
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50">
                                                <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500 font-medium">Solutions hidden during exam.</p>
                                                <p className="text-xs text-gray-400">Available in {formatTime(timeLeft)}</p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

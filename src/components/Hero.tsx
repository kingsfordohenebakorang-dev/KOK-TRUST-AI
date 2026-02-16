"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Sigma } from "lucide-react"

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row items-center gap-12">

                {/* Text Content */}
                <div className="flex-1 space-y-8 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-300 mb-6">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                            Actuarial Intelligence v1.0
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                                Master Actuarial <br /> Science with AI
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl"
                    >
                        Upload your lecture notes. Get step-by-step symbolic solutions,
                        provenance-backed answers, and interactive visualizations.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                    >
                        <button className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold overflow-hidden transition-transform hover:scale-105">
                            <span className="relative z-10 flex items-center gap-2">
                                Start Studying <ArrowRight className="w-4 h-4" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <button className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium transition-colors flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-400" /> View Syllabus
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="pt-8 flex items-center gap-6 text-sm text-gray-500 font-mono justify-center md:justify-start"
                    >
                        <span className="flex items-center gap-2"><Sigma className="w-4 h-4" /> LaTeX Support</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span>SOA/CAS Aligned</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span>Symbolic Solver</span>
                    </motion.div>
                </div>

                {/* Hero Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex-1 w-full max-w-[500px] aspect-square relative"
                >
                    {/* Main Card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl border border-white/10 backdrop-blur-xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                        {/* Mock Chat Interface */}
                        <div className="h-full flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0" />
                                <div className="glass p-4 rounded-2xl rounded-tl-none text-sm text-gray-300">
                                    <p>Calculate the present value of a 10-year annuity-due of 1000 with $i=5\%$.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                                    <Sigma className="w-4 h-4 text-white" />
                                </div>
                                <div className="glass p-4 rounded-2xl rounded-tr-none text-sm text-white w-full">
                                    <p className="font-mono text-xs text-indigo-300 mb-2">Asking SymPy...</p>
                                    <p className="mb-2">Using the formula for annuity-due:</p>
                                    <div className="p-3 bg-black/40 rounded-lg font-mono text-center my-2 border border-white/5">
                                        {'$$\\ddot{a}_{\\overline{n}|} = \\frac{1 - v^n}{d}$$'}
                                    </div>
                                    <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        Verified from Life Contingencies P.42
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute -top-8 -right-8 p-4 glass rounded-2xl border border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">A+</div>
                            <div className="text-xs">
                                <div className="font-bold text-white">Exam P</div>
                                <div className="text-gray-400">98% Accuracy</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    )
}

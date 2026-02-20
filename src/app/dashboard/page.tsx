"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { FileText, Clock, Plus, BarChart2, BookOpen, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const recentFiles = [
        { id: '1', title: 'Week_3_Annuities.pdf', type: 'PDF', date: '2h ago', status: 'Indexed' },
        { id: '2', title: 'Exam_Itam_Practice.pdf', type: 'PDF', date: '1d ago', status: 'Indexed' },
        { id: '3', title: 'Survival_Models_Ch5.pdf', type: 'PDF', date: '3d ago', status: 'Processing' },
    ];

    const studySessions = [
        { id: '1', topic: 'Variance of Annuity Due', lastActive: '10m ago', document: 'Week_3_Annuities.pdf' },
        { id: '2', topic: 'Force of Mortality Derivation', lastActive: '1d ago', document: 'Exam_Itam_Practice.pdf' },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            <Navbar />

            <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12 pb-20">
                {/* Dashboard Hero */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
                        >
                            Dashboard
                        </motion.h1>
                        <p className="text-gray-400 mt-1 text-sm">Welcome back, Alex. You have 2 upcoming exams.</p>
                    </div>

                    <div className="flex gap-3">
                        <Link href="/upload" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20">
                            <Plus className="w-4 h-4" /> New Upload
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Study Hours', value: '12.5h', icon: Clock, trend: '+15%', color: 'text-blue-400' },
                        { label: 'Problems Solved', value: '42', icon: BarChart2, trend: '+8', color: 'text-green-400' },
                        { label: 'Documents', value: '15', icon: BookOpen, trend: 'Indexed', color: 'text-purple-400' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-mono text-gray-500 bg-black/20 px-2 py-1 rounded">{stat.trend}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-100">{stat.value}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Files */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-400" /> Recent Documents
                            </h2>
                            <button className="text-xs text-indigo-400 hover:text-white transition-colors">View All</button>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                            <div className="grid grid-cols-12 text-xs text-gray-500 border-b border-white/5 bg-black/20 p-4 font-medium uppercase tracking-wider">
                                <div className="col-span-6">Name</div>
                                <div className="col-span-2">Type</div>
                                <div className="col-span-2">Date</div>
                                <div className="col-span-2 text-right">Status</div>
                            </div>
                            <div className="divide-y divide-white/5">
                                {recentFiles.map((file) => (
                                    <Link key={file.id} href={`/study/${file.id}`} className="grid grid-cols-12 p-4 items-center hover:bg-white/5 transition-colors group cursor-pointer text-sm">
                                        <div className="col-span-6 flex items-center gap-3 font-medium text-gray-300 group-hover:text-white">
                                            <div className="w-8 h-8 rounded bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            {file.title}
                                        </div>
                                        <div className="col-span-2 text-gray-500 text-xs bg-white/5 w-fit px-2 py-1 rounded">{file.type}</div>
                                        <div className="col-span-2 text-gray-500 text-xs">{file.date}</div>
                                        <div className="col-span-2 text-right">
                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-full",
                                                file.status === 'Indexed' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 animate-pulse"
                                            )}>
                                                {file.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Sessions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-400" /> Jump Back In
                        </h2>
                        <div className="space-y-3">
                            {studySessions.map((session) => (
                                <Link key={session.id} href={`/study/${session.id}`} className="block bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-indigo-500/30 rounded-xl p-4 transition-all hover:translate-x-1 group">
                                    <h4 className="font-medium text-gray-200 group-hover:text-indigo-300 transition-colors">{session.topic}</h4>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <FileText className="w-3 h-3" />
                                        <span className="truncate max-w-[150px]">{session.document}</span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                        <span>{session.lastActive}</span>
                                    </div>
                                </Link>
                            ))}

                            <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2">
                                <Search className="w-4 h-4" /> Global Search
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

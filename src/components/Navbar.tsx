"use client"
import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, Calculator, Upload } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/20 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">
                    <Calculator className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Actuarial<span className="text-indigo-400">GPT</span>
                </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                <Link href="#" className="hover:text-white transition-colors">Syllabus</Link>
                <Link href="#" className="hover:text-white transition-colors">Exams</Link>
                <Link href="#" className="hover:text-white transition-colors">Community</Link>
            </div>

            <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Log In
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Notes</span>
                </button>
            </div>
        </nav>
    );
}

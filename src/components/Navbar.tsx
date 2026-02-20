"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Upload, LogOut, User as UserIcon, Calculator } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 w-full h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 z-50">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">
                    <Calculator className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    KOK<span className="text-indigo-400">TRUST</span>AI
                </span>
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
                <Link href="/chat" className="hover:text-white transition-colors text-indigo-400 font-semibold">Tutor AI</Link>
                <Link href="/exams" className="hover:text-white transition-colors">Exams</Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className={cn("hover:text-white transition-colors", pathname === '/dashboard' && "text-white")}>
                            Dashboard
                        </Link>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <div className="flex items-center gap-2 text-gray-200">
                            <UserIcon className="w-4 h-4" />
                            <span>{user.name}</span>
                        </div>
                        <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-400" title="Logout">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
                )}

                <Link
                    href="/upload"
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    <span>Upload Notes</span>
                </Link>
            </div>
        </nav>
    );
}

"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Check, Zap, Shield, Crown } from 'lucide-react';

export default function LoginPage() {
    // 1. New 'step' state to manage flow: 'auth' -> 'pricing'
    const [step, setStep] = useState<'auth' | 'pricing'>('auth');
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (email === 'admin@actuary.com' && password === 'admin') {
            setStep('pricing'); // Move to pricing instead of redirect
        } else if (isSignUp) {
            setStep('pricing'); // Move to pricing
        } else {
            setError('Invalid credentials');
            setIsLoading(false);
        }
    };

    const handlePlanSelect = (plan: string) => {
        console.log(`Selected plan: ${plan}`);
        window.location.href = '/dashboard';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-50 z-0" />

            <AnimatePresence mode="wait">
                {step === 'auth' ? (
                    /* --- AUTHENTICATION VIEW --- */
                    <motion.div
                        key="auth-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl z-10 relative"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                {isSignUp ? "Create Account" : "Welcome Back"}
                            </h1>
                            <p className="text-sm text-gray-400 mt-2">
                                {isSignUp ? "Join the elite actuarial learning platform." : "Sign in to continue your actuarial journey."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence>
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                                placeholder="John Doe"
                                                required={isSignUp}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                        placeholder="student@university.edu"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>{isSignUp ? "Continue to Plans" : "Sign In"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-500">
                                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1 font-semibold hover:underline"
                                >
                                    {isSignUp ? "Log in" : "Sign up for free"}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    /* --- PRICING VIEW --- */
                    <motion.div
                        key="pricing-grid"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full max-w-5xl z-10"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-white mb-4">Choose Your Path</h2>
                            <p className="text-gray-400">Select a plan to unlock full actuarial potential.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <PricingCard
                                title="Free"
                                price="GH₵ 0"
                                icon={<Shield className="w-6 h-6 text-gray-400" />}
                                features={["Daily AI queries (3)", "Basic formulae search", "Community access"]}
                                onSelect={() => handlePlanSelect('free')}
                            />
                            <PricingCard
                                title="Semester Pass"
                                price="GH₵ 169"
                                highlighted
                                icon={<Zap className="w-6 h-6 text-yellow-400" />}
                                features={["Unlimited AI Tutor", "Actuarial Library access", "Past Paper solutions", "Priority response"]}
                                onSelect={() => handlePlanSelect('pro')}
                            />
                            <PricingCard
                                title="Elite"
                                price="GH₵ 299"
                                icon={<Crown className="w-6 h-6 text-purple-400" />}
                                features={["All Pro features", "Professional Mentorship", "CV Review for Internships", "Custom Risk Models"]}
                                onSelect={() => handlePlanSelect('elite')}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-6 text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">
                Secure Actuarial Network • 256-Bit Encryption
            </div>
        </div>
    );
}

/* --- HELPER COMPONENT: PRICING CARD --- */
function PricingCard({ title, price, features, highlighted = false, icon, onSelect }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-8 rounded-2xl border transition-all flex flex-col ${highlighted
                    ? 'bg-white/10 border-indigo-500 shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]'
                    : 'bg-white/5 border-white/10'
                }`}
        >
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <div className="mb-6">
                <span className="text-4xl font-bold">{price}</span>
                <span className="text-gray-500 text-sm">/semester</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-indigo-400" /> {f}
                    </li>
                ))}
            </ul>
            <button
                onClick={onSelect}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${highlighted
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
            >
                Get Started
            </button>
        </motion.div>
    );
}

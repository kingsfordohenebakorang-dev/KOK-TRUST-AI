"use client"
import { motion } from "framer-motion";
import { Check, Star, Shield, Zap, Building2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Free Tier",
        price: "GH₵ 0",
        period: "/forever",
        description: "Essential trial for quick reference.",
        features: [
            "5 Document Uploads",
            "25 AI Queries / Month",
            "1 Exam-Style Generation",
            "Standard Response Speed"
        ],
        buttonText: "Start for Free",
        buttonLink: "/login",
        popular: false,
        icon: Zap
    },
    {
        name: "Pro Student",
        price: "GH₵ 49",
        period: "/month",
        description: "Serious prep with higher limits.",
        features: [
            "50 Document Uploads",
            "300 AI Queries / Month",
            "20 Exam-Style Generations",
            "Notebook Mode Access",
            "Priority Response Speed"
        ],
        buttonText: "Go Pro",
        buttonLink: "/register?plan=pro",
        popular: false,
        icon: Star
    },
    {
        name: "KOK Semester Pass",
        price: "GH₵ 169",
        period: "/semester",
        description: "The ultimate 4-month package for top students.",
        features: [
            "150 Document Uploads",
            "1,200 AI Queries Total",
            "80 Exam-Style Generations",
            "Verified Solutions & Offline Mode",
            "Priority Queue Access"
        ],
        buttonText: "Get Best Value",
        buttonLink: "/register?plan=semester",
        popular: true,
        icon: Shield
    }
];

export function PricingSection() {
    return (
        <section className="relative py-24 px-6 md:px-12 bg-black border-t border-white/5 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">
                        Invest in Your Future
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Sustainable, high-performance AI tools tailored for your academic success.
                        The <span className="text-indigo-400 font-semibold">KOK Semester Pass</span> offers the best value for dedicated students.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "relative p-8 rounded-2xl border backdrop-blur-sm transition-all group hover:scale-105 duration-300 flex flex-col h-full",
                                plan.popular
                                    ? "bg-gradient-to-b from-indigo-900/20 to-black border-indigo-500/50 shadow-2xl shadow-indigo-900/20 z-10 scale-105"
                                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                                    Best Value
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn("p-2 rounded-lg", plan.popular ? "bg-indigo-500/20 text-indigo-400" : "bg-white/10 text-gray-400")}>
                                    <plan.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                            </div>

                            <div className="mb-4">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
                            </div>

                            <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className={cn("w-5 h-5 shrink-0", plan.popular ? "text-indigo-400" : "text-gray-500")} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.buttonLink} className={cn(
                                "w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center",
                                plan.popular
                                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25"
                                    : "bg-white/10 hover:bg-white/20 text-white"
                            )}>
                                {plan.buttonText}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Institutional Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Institutional Access</h3>
                            </div>
                            <p className="text-gray-400 max-w-xl mb-4">
                                Tailored solutions for University of Ghana, KNUST, and UCC.
                                Centralized billing, admin dashboards, and custom analytics for departments.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-mono">
                                <span>• 500+ Students</span>
                                <span>• Admin Dashboard</span>
                                <span>• Usage Analytics</span>
                            </div>
                        </div>
                        <Link
                            href="mailto:partnerships@koktrust.ai"
                            className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors whitespace-nowrap"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

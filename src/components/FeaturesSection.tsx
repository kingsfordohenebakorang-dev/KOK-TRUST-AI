"use client"
import { motion } from "framer-motion";
import { Zap, BookOpen, GraduationCap, BarChart3, Lock, MessageSquare, Users, BrainCircuit } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Users,
        title: "The Lecturer Layer",
        description: "Official verified syllabi, authenticated mock exams, and aggregated cohort analytics for department heads.",
        link: "/dashboard",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20"
    },
    {
        icon: BarChart3,
        title: "Institutional Dashboard",
        description: "Cohort-level metrics, weakness heatmaps, and exportable reports for semester review meetings.",
        link: "/dashboard",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        icon: BrainCircuit,
        title: "Predictive Analytics",
        description: "Probability-based exam readiness scores calculate your chance of achieving an A based on trend analysis.",
        link: "/dashboard",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        icon: GraduationCap,
        title: "Timed Simulation Mode",
        description: "Realistic exam conditions with countdown timers, controlled navigation, and auto-submission.",
        link: "/exams",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        icon: Zap,
        title: "Mobile & Retention Tools",
        description: "PWA with offline flashcards, spaced repetition nudges, and streak systems to build habit.",
        link: "/study",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20"
    },
    {
        icon: MessageSquare,
        title: "Growth Mechanics",
        description: "Campus ambassador programs, referral incentives, and cross-departmental adoption frameworks.",
        link: "/register",
        color: "text-pink-400",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20"
    }
];

export function FeaturesSection() {
    return (
        <section className="relative py-24 px-6 md:px-12 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">
                        Complete Actuarial Toolkit
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Everything you need to master your exams, from intelligent tutoring to automated mock papers.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <Link href={feature.link} key={idx}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`h-full p-8 rounded-2xl border ${feature.border} bg-white/5 hover:bg-white/10 transition-all group backdrop-blur-sm cursor-pointer`}
                            >
                                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-white transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300">
                                    {feature.description}
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

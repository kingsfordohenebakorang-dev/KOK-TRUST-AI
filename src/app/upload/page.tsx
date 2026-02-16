"use client"
import { Navbar } from "@/components/Navbar";
import { FileUpload } from "@/components/FileUpload";
import { motion } from "framer-motion";

export default function UploadPage() {
    return (
        <main className="dark min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-hidden">
            <Navbar />

            <div className="relative pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 relative z-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                            Ingest Your Knowledge Base
                        </span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto text-lg">
                        Drag and drop your lecture notes, exams, or cheat sheets.
                        Our AI will index the math, figures, and text for instant recall.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full relative z-10"
                >
                    <FileUpload />
                </motion.div>

                {/* Footer info */}
                <div className="mt-16 text-center text-sm text-gray-500 font-mono">
                    <p>System Status: <span className="text-green-500">Online</span> • Vector DB: <span className="text-yellow-500">Connecting...</span></p>
                </div>
            </div>
        </main>
    );
}

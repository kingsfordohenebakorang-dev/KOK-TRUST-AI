"use client"
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MathBlock } from './MathBlock';

interface FileStatus {
    file: File;
    id: string;
    status: 'idle' | 'uploading' | 'processing' | 'done' | 'error';
    progress: number;
    message?: string;
    extractedMath?: string[]; // Preview extracted LaTeX
}

export function FileUpload() {
    const [files, setFiles] = useState<FileStatus[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            id: Math.random().toString(36).substring(7),
            status: 'idle' as const,
            progress: 0
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'application/x-tex': ['.tex']
        },
        maxSize: 10 * 1024 * 1024 // 10MB
    });

    const uploadFile = async (fileStatus: FileStatus) => {
        // Optimistic UI update
        setFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'uploading', progress: 10 } : f));

        const formData = new FormData();
        formData.append('file', fileStatus.file);

        try {
            // Simulate progress for cinematic feel
            const interval = setInterval(() => {
                setFiles(prev => prev.map(f => {
                    if (f.id === fileStatus.id && f.status === 'uploading') {
                        return { ...f, progress: Math.min(f.progress + 10, 90) };
                    }
                    return f;
                }));
            }, 300);

            const response = await fetch('/api/ingest', {
                method: 'POST',
                body: formData,
            });

            clearInterval(interval);

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Upload failed');

            setFiles(prev => prev.map(f => f.id === fileStatus.id ? {
                ...f,
                status: 'done',
                progress: 100,
                message: 'Successfully indexed.',
                extractedMath: data.extractedMath // If API returns sample extracted math
            } : f));

        } catch (error) {
            console.error(error);
            setFiles(prev => prev.map(f => f.id === fileStatus.id ? {
                ...f,
                status: 'error',
                progress: 0,
                message: 'Failed to process.'
            } : f));
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <div
                {...getRootProps()}
                className={cn(
                    "relative group border-2 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm",
                    isDragActive ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5",
                    "glass"
                )}
            >
                <input {...getInputProps()} />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-colors" />

                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/5 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <Upload className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xl font-medium text-white group-hover:text-indigo-200 transition-colors">
                            {isDragActive ? "Drop your actuarial notes here" : "Drag & Drop or Click to Upload"}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Supports PDF, PNG, LaTeX (.tex) up to 10MB
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {files.map(file => (
                        <motion.div
                            key={file.id}
                            layout
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                                    {file.status === 'uploading' ? (
                                        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                                    ) : file.status === 'done' ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    ) : file.status === 'error' ? (
                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                    ) : (
                                        <FileText className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-medium text-sm text-gray-200 truncate pr-4">{file.file.name}</p>
                                        {file.status === 'idle' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                                                className="p-1 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Progress Bar / Status */}
                                    {file.status === 'idle' ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            <button
                                                onClick={() => uploadFile(file)}
                                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                Start Upload
                                            </button>
                                        </div>
                                    ) : file.status === 'done' ? (
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-green-400">Indexed & Ready</span>
                                            <a href={`/study/${file.id}`} className="px-3 py-1 text-xs bg-indigo-500 hover:bg-indigo-400 text-white rounded-full transition-colors font-medium flex items-center gap-1">
                                                Start Studying <ChevronRight className="w-3 h-3" />
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className={cn(
                                                    "h-full rounded-full",
                                                    file.status === 'error' ? "bg-red-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"
                                                )}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${file.progress}%` }}
                                                transition={{ ease: "easeOut" }}
                                            />
                                        </div>
                                    )}

                                    {file.message && (
                                        <p className={cn("text-xs mt-2", file.status === 'error' ? "text-red-400" : "text-green-400")}>
                                            {file.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Optional: Show extracted math preview if returned */}
                            {file.extractedMath && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="mt-4 pt-4 border-t border-white/5"
                                >
                                    <p className="text-xs text-gray-500 mb-2 font-mono uppercase tracking-wider">Preview Extraction</p>
                                    <div className="bg-black/20 rounded p-3 text-sm overflow-x-auto">
                                        <MathBlock latex={file.extractedMath[0]} />
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

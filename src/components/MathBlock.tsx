"use client"
import React from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MathBlockProps {
    latex: string;
    block?: boolean;
    className?: string;
    animate?: boolean;
}

export function MathBlock({ latex, block = false, className, animate = true }: MathBlockProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (containerRef.current) {
            try {
                katex.render(latex, containerRef.current, {
                    throwOnError: false,
                    displayMode: block,
                    output: 'html', // or 'htmlAndMathml'
                });
            } catch (e) {
                console.error("KaTeX render error:", e);
                containerRef.current.innerText = latex;
            }
        }
    }, [latex, block]);

    return (
        <motion.span
            ref={containerRef}
            className={cn("inline-block text-white/90 font-serif", className)}
            initial={animate ? { opacity: 0, scale: 0.95 } : undefined}
            animate={animate ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.5, ease: "easeOut" }}
        />
    );
}

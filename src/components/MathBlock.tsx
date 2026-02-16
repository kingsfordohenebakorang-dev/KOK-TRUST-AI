"use client"
import React from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { cn } from '@/lib/utils';

interface MathBlockProps {
    latex: string;
    block?: boolean;
    className?: string;
}

export function MathBlock({ latex, block = false, className }: MathBlockProps) {
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

    return <span ref={containerRef} className={cn("inline-block", className)} />;
}

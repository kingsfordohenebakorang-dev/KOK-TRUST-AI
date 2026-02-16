"use client"
import React from 'react';
import { motion } from 'framer-motion';

interface GraphVisualizerProps {
    data: any;
}

export function GraphVisualizer({ data }: GraphVisualizerProps) {
    if (!data || !data.nodes || data.nodes.length === 0) return null;

    const centerX = 150;
    const centerY = 150;
    const radius = 80;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-6 right-6 w-[300px] h-[300px] bg-black/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl z-50 pointer-events-none md:pointer-events-auto"
        >
            <div className="absolute top-3 left-4 text-[10px] font-mono text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                Knowledge Graph
            </div>

            <svg width="300" height="300" className="w-full h-full">
                {/* Edges */}
                {data.nodes.map((node: any, i: number) => {
                    const angle = (i / data.nodes.length) * Math.PI * 2;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;

                    return (
                        <motion.line
                            key={`edge-${i}`}
                            x1={centerX} y1={centerY}
                            x2={x} y2={y}
                            stroke="rgba(99, 102, 241, 0.3)"
                            strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    );
                })}

                {/* Center Node (Topic) */}
                <motion.circle cx={centerX} cy={centerY} r={6} fill="#fff" />

                {/* Outer Nodes */}
                {data.nodes.map((node: any, i: number) => {
                    const angle = (i / data.nodes.length) * Math.PI * 2;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;

                    return (
                        <g key={node.id}>
                            <motion.circle
                                cx={x} cy={y}
                                r={node.label === 'Formula' ? 5 : 4}
                                fill={node.label === 'Formula' ? '#ec4899' : '#6366f1'}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                            />
                            <motion.text
                                x={x + 10} y={y + 4}
                                fill="rgba(255,255,255,0.7)"
                                fontSize="10"
                                fontFamily="monospace"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 + (i * 0.1) }}
                            >
                                {node.name.length > 12 ? node.name.substring(0, 10) + '..' : node.name}
                            </motion.text>
                        </g>
                    );
                })}
            </svg>
        </motion.div>
    );
}

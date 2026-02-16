"use client"
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ChatInterface } from '@/components/ChatInterface';
import { DocumentViewer } from '@/components/DocumentViewer';

export default function StudySessionPage({ params }: { params: { id: string } }) {
    const fileId = params.id;

    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 pt-16 relative z-0 h-full flex flex-row">
                {/* Left Panel: Chat & Solver */}
                <div className="w-[40%] min-w-[350px] h-full bg-black/95 border-r border-white/5 flex flex-col">
                    <ChatInterface />
                </div>

                {/* Right Panel: Document Viewer */}
                <div className="flex-1 h-full bg-[#1a1a1e] relative">
                    <DocumentViewer fileName={`Actuarial_Notes_${fileId}.pdf`} />
                </div>
            </div>
        </div>
    );
}

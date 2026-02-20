import { NextResponse } from 'next/server';
import { solveActuarialProblem } from '@/lib/sympy';
import { router } from '@/lib/router';

export async function POST(req: Request) {
    try {
        const { message, history, mode } = await req.json();

        // Connect to Router (Sprint 3)
        // Pass mode ('study' or 'tutor')
        const routerResult = await router.process(message, mode || 'study');

        // If Hybrid/Conceptual, attach graph context to response
        const graphData = routerResult.graph_context ? routerResult.graph_context : null;

        return NextResponse.json({
            role: 'assistant',
            content: routerResult.content || `According to ${routerResult.source} derived for your query: "${message}"`,
            steps: routerResult.steps,
            final_answer: routerResult.final_answer,
            citations: [
                { source: routerResult.source, page: 42, confidence: 0.95 }
            ],
            graph_context: graphData // New output for Frontend Graph Visualizer
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

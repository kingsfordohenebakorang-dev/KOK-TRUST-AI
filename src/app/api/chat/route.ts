import { NextResponse } from 'next/server';
import { solveActuarialProblem } from '@/lib/sympy';
import { router } from '@/lib/router';

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        // Connect to Router (Sprint 3)
        // const symbolicSolution = await solveActuarialProblem(message); // Replaced with Router
        const routerResult = await router.process(message);

        // If Hybrid/Conceptual, attach graph context to response
        const graphData = routerResult.graph_context ? routerResult.graph_context : null;

        return NextResponse.json({
            role: 'assistant',
            content: `According to ${routerResult.source} derived for your query: "${message}"`,
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

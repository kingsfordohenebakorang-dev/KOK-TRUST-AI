import { NextResponse } from 'next/server';
import { solveActuarialProblem } from '@/lib/sympy';

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        // Connect to SymPy Solver Logic (Sprint 2)
        const symbolicSolution = await solveActuarialProblem(message);

        return NextResponse.json({
            role: 'assistant',
            content: `Here is the step-by-step derivation for your query: "${message}"`,
            steps: symbolicSolution.steps,
            final_answer: symbolicSolution.final_answer,
            citations: [
                { source: symbolicSolution.source, page: 42, confidence: 0.95 } // Mock metadata
            ]
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        // Mock response for MVP
        // In production: Connect to OpenAI/LLM + SymPy Tool

        // Simulate latency for cinematic feel
        await new Promise(resolve => setTimeout(resolve, 1500));

        return NextResponse.json({
            role: 'assistant',
            content: `Here is the solution to your query about "${message.substring(0, 20)}...":

The **present value** of an annuity-due is given by:
$$ \\ddot{a}_{\\overline{n}|} = \\frac{1 - v^n}{d} $$

Step 1: Calculate the discount factor $v$.
$$ v = \\frac{1}{1+i} $$

Step 2: Calculate the discount rate $d$.
$$ d = \\frac{i}{1+i} $$

Based on your uploaded notes (Week_3_Annuities.pdf, p.15), we use $i=0.05$.`,
            citations: [
                { source: 'Week_3_Annuities.pdf', page: 15, confidence: 0.95 }
            ]
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

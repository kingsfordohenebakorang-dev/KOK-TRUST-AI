import { solveActuarialProblem } from './sympy';
import { graphService } from './graph';

export enum QueryType {
    COMPUTATIONAL = 'COMPUTATIONAL',
    CONCEPTUAL = 'CONCEPTUAL',
    HYBRID = 'HYBRID'
}

export interface RouterResponse {
    type: QueryType;
    steps: any[];
    graph_context?: any;
    final_answer: string;
    source: string;
}

export class QueryRouter {

    classify(query: string): QueryType {
        const q = query.toLowerCase();

        // Simple heuristic classifier
        if (q.includes('calculate') || q.includes('solve') || q.includes('value of')) {
            if (q.includes('explain') || q.includes('why')) {
                return QueryType.HYBRID;
            }
            return QueryType.COMPUTATIONAL;
        }

        if (q.includes('what is') || q.includes('model') || q.includes('concept')) {
            return QueryType.CONCEPTUAL;
        }

        return QueryType.HYBRID; // Default fall back
    }

    async process(query: string): Promise<RouterResponse> {
        const type = this.classify(query);
        console.log(`[Router] Processing query as ${type}`);

        let steps = [];
        let final_answer = '';
        let graph_context = null;
        let source = 'General Knowledge';

        switch (type) {
            case QueryType.COMPUTATIONAL:
            case QueryType.HYBRID:
                // Execute Symbolic Solver (Sprint 2 Logic)
                const mathResult = await solveActuarialProblem(query);
                steps = mathResult.steps;
                final_answer = mathResult.final_answer;
                source = mathResult.source;

                // If Hybrid, fetch context
                if (type === QueryType.HYBRID) {
                    // Extract keywords (naive) -> 'variance', 'annuity'
                    const keywords = query.split(' ').filter(w => w.length > 5);
                    // Query Graph Service for first keyword found
                    if (keywords.length > 0) {
                        graph_context = await graphService.queryConcept(keywords[0]);
                    }
                }
                break;

            case QueryType.CONCEPTUAL:
                // Pure Graph Retrieval
                const concepts = await graphService.queryConcept(query);
                graph_context = concepts;
                source = 'Actuarial Knowledge Graph';
                final_answer = `Found ${concepts.nodes.length} related concepts in the Knowledge Graph.`;
                steps = concepts.nodes.map(n => ({
                    id: n.id,
                    latex: n.label === 'Formula' ? n.name : '',
                    explanation: `${n.label}: ${n.name}`
                }));
                break;
        }

        return {
            type,
            steps,
            graph_context,
            final_answer,
            source
        };
    }
}

export const router = new QueryRouter();

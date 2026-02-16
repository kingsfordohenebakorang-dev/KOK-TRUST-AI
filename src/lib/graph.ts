export interface GraphNode {
    id: string;
    label: string; // 'Concept', 'Formula', 'Theorem', 'Exam'
    name: string;
    properties?: Record<string, any>;
}

export interface GraphEdge {
    source: string;
    target: string;
    relationship: string; // 'DERIVED_FROM', 'TESTED_IN', 'MENTIONS'
}

export interface GraphResult {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

// Mock Graph Database (in-memory adjacency list for MVP)
// ideally this connects to Neo4j
const MOCK_GRAPH_DATA: { nodes: GraphNode[], edges: GraphEdge[] } = {
    nodes: [
        { id: 'c1', label: 'Concept', name: 'Survival Function' },
        { id: 'c2', label: 'Concept', name: 'Force of Mortality' },
        { id: 'c3', label: 'Concept', name: 'Life Table' },
        { id: 'f1', label: 'Formula', name: 'S_x(t) = exp(-integral mu)' },
        { id: 'e1', label: 'Exam', name: 'Exam FAM' },
        { id: 't1', label: 'Theorem', name: 'Law of Large Numbers' }
    ],
    edges: [
        { source: 'c2', target: 'c1', relationship: 'DERIVED_FROM' },
        { source: 'f1', target: 'c1', relationship: 'DEFINES' },
        { source: 'c1', target: 'e1', relationship: 'TESTED_IN' },
        { source: 'c3', target: 'c1', relationship: 'DEPENDS_ON' }
    ]
};

export class KnowledgeGraphService {
    async queryConcept(conceptName: string): Promise<GraphResult> {
        // Simulate DB latency
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simple textual match for MVP
        const relevantNodes = MOCK_GRAPH_DATA.nodes.filter(n =>
            n.name.toLowerCase().includes(conceptName.toLowerCase()) ||
            MOCK_GRAPH_DATA.edges.some(e => e.source === n.id && e.target === MOCK_GRAPH_DATA.nodes.find(tn => tn.name.toLowerCase().includes(conceptName.toLowerCase()))?.id)
        );

        const relevantEdges = MOCK_GRAPH_DATA.edges.filter(e =>
            relevantNodes.some(n => n.id === e.source || n.id === e.target)
        );

        return { nodes: relevantNodes, edges: relevantEdges };
    }

    async getRelatedFormulas(topic: string): Promise<GraphNode[]> {
        const data = await this.queryConcept(topic);
        return data.nodes.filter(n => n.label === 'Formula');
    }

    async getExamMapping(topic: string): Promise<string[]> {
        const data = await this.queryConcept(topic);
        return data.nodes
            .filter(n => n.label === 'Exam')
            .map(n => n.name);
    }
}

export const graphService = new KnowledgeGraphService();

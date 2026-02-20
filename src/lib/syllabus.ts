export interface SyllabusTopic {
    id: string;
    title: string;
    weight: number; // 0-100
    level: 'Core' | 'Advanced' | 'Niche';
    formulas: string[];
}

export const MOCK_SYLLABUS: SyllabusTopic[] = [
    {
        id: 't1',
        title: 'Time Value of Money',
        weight: 15,
        level: 'Core',
        formulas: ['v = (1+i)^{-1}', 'd = iv', 'a_{\\overline{n}|} = (1-v^n)/i']
    },
    {
        id: 't2',
        title: 'Survival Models',
        weight: 25,
        level: 'Core',
        formulas: ['{}_tp_x = e^{-\\int_0^t \\mu_{x+s} ds}', 'e_x = \\int_0^\\omega {}_tp_x dt']
    },
    {
        id: 't3',
        title: 'Life Insurance',
        weight: 20,
        level: 'Advanced',
        formulas: ['A_x = \\int_0^\\infty v^t {}_tp_x \\mu_{x+t} dt']
    },
    {
        id: 't4',
        title: 'Annuities',
        weight: 30,
        level: 'Advanced',
        formulas: ['\\ddot{a}_x = \\sum_{k=0}^\\infty v^k {}_kp_x']
    },
    {
        id: 't5',
        title: 'Premium Calculation',
        weight: 10,
        level: 'Niche',
        formulas: ['P = \\frac{A_x}{\\ddot{a}_x}']
    }
];

export interface ExamProfile {
    id: string;
    name: string;
    question_style: 'Theoretical' | 'Computational' | 'Mixed';
    avg_marks: number;
}

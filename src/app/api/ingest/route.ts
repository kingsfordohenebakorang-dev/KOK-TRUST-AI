import { NextResponse } from 'next/server';
import { processImageWithMathPix } from '@/lib/mathpix';
// Polyfill for pdf-parse in Next.js environment
if (typeof Promise.withResolvers === 'undefined') {
    // @ts-ignore
    Promise.withResolvers = function () {
        let resolve, reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    };
}
// Specific polyfill for pdf-parse/canvas dependency
// @ts-ignore
if (typeof DOMMatrix === 'undefined') {
    // @ts-ignore
    global.DOMMatrix = class DOMMatrix { };
}
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require('pdf-parse');

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        let textContent = '';
        let extractedMath: string[] = [];

        // Basic PDF Parsing vs Image OCR
        if (file.type === 'application/pdf') {
            const data = await pdf(buffer);
            textContent = data.text;

            // Regex fallback for PDF
            const mathMatches = textContent.match(/[$].*?[$]/g) || [];
            extractedMath = mathMatches.slice(0, 3);
        } else if (file.type.startsWith('image/')) {
            // Sprint 2: Integrate MathPix OCR
            const result = await processImageWithMathPix(buffer);
            textContent = result.text;
            if (result.latex_styled) {
                extractedMath = [result.latex_styled]; // High fidelity math found
            }
        } else {
            textContent = buffer.toString('utf-8');
        }

        // Chunking Logic (Simplified)
        const chunks = textContent.split(/\n\s*\n/).filter(c => c.length > 50).slice(0, 5);

        // Placeholder: Vector Upsert
        // await pinecone.upsert(chunks.map(embed));

        // Simulate "Processing Delay" for cinematic effect
        await new Promise(r => setTimeout(r, 1000));

        return NextResponse.json({
            message: 'File processed successfully.',
            fileId: 'file_' + Math.random().toString(36).substring(7),
            pageCount: (file.type === 'application/pdf') ? 'Unknown (pdf-parse limitation)' : 1,
            snippet: textContent.substring(0, 200) + '...',
            extractedMath: extractedMath.length > 0 ? extractedMath : ['$$ E[X] = \\int x f(x) dx $$ (Example)'], // Fallback example if no math found
            chunksCount: chunks.length
        });
    } catch (error) {
        console.error('Ingestion Error:', error);
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
    }
}

export interface MathPixResponse {
    text: string;
    latex_styled?: string;
    confidence?: number;
}

export async function processImageWithMathPix(buffer: Buffer): Promise<MathPixResponse> {
    const MATHPIX_APP_ID = process.env.MATHPIX_APP_ID;
    const MATHPIX_APP_KEY = process.env.MATHPIX_APP_KEY;

    // MVP: If no keys are present, return a high-fidelity mock response
    // so the user can see the cinematic experience immediately.
    if (!MATHPIX_APP_ID || !MATHPIX_APP_KEY) {
        console.warn("MathPix keys missing. Returning mock OCR data.");
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency

        return {
            text: "The present value of a continuous annuity is given by $ \\bar{a}_{\\overline{n}|} = \\frac{1 - e^{-\\delta n}}{\\delta} $.",
            latex_styled: "\\bar{a}_{\\overline{n}|} = \\frac{1 - e^{-\\delta n}}{\\delta}",
            confidence: 0.98
        };
    }

    try {
        const response = await fetch('https://api.mathpix.com/v3/text', {
            method: 'POST',
            headers: {
                'app_id': MATHPIX_APP_ID,
                'app_key': MATHPIX_APP_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                src: `data:image/jpeg;base64,${buffer.toString('base64')}`,
                formats: ['text', 'latex_styled'],
                math_inline_delimiters: ['$', '$'],
                rm_spaces: true
            })
        });

        if (!response.ok) {
            throw new Error(`MathPix API Error: ${response.statusText}`);
        }

        const data = await response.json() as any;
        return {
            text: data.text,
            latex_styled: data.latex_styled,
            confidence: data.confidence
        };
    } catch (error) {
        console.error("MathPix Extraction Failed:", error);
        throw error;
    }
}

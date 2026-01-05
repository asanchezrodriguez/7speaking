import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { transcript, targetLanguage, voiceData } = req.body;

    if (!transcript || !targetLanguage) {
        return res.status(400).json({ error: 'Transcript and target language are required' });
    }

    const rawEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
    const apiVersion = '2024-08-01-preview';

    if (!rawEndpoint || !apiKey) {
        return res.status(500).json({ error: 'Azure OpenAI configuration missing on server' });
    }

    const endpoint = rawEndpoint.endsWith('/') ? rawEndpoint.slice(0, -1) : rawEndpoint;

    const voiceContext = voiceData ? `
The text was provided via VOICE recording.
- Total Duration: ${voiceData.duration}s
- Average Speed: ${(voiceData.words.length / (voiceData.duration / 60)).toFixed(1)} words per minute.

Evaluate the voice delivery:
1. Identify hesitations (long gaps > 1.2s).
2. Assess naturalness based on the word flow.
3. If the transcript contains phonetic inconsistencies or common non-native errors, highlight them.
` : '';

    const prompt = `You are an expert language assessment AI specialized in evaluating second language proficiency. You are warm, encouraging, and honest.

Analyze the following text written/spoken by a learner of ${targetLanguage} as their target second language. ${voiceContext}

CONTEXT & PERFORMANCE GUIDELINES:
- The learner is being assessed in ${targetLanguage}.
- If the learner has poor knowledge of ${targetLanguage}, they might have used some Spanish (their native language). This is "interlanguage".
- If the text is primarily in Spanish, evaluate as A1 in ${targetLanguage}.

GOAL: Produce TRULY GENERATIVE AND UNIQUE feedback. Avoid generic phrases like "Patrón de éxito" if you can come up with a more specific title based on the input.

TEXT TO ANALYZE:
"""
${transcript}
"""

Provide a comprehensive analysis in JSON format with the following structure:

{
  "estimatedLevel": "A1" | "A2" | "B1" | "B1+" | "B2" | "C1" | "C2",
  "percentile": <number 0-100>,
  "strength": {
    "title": "<creative title in Spanish, e.g. 'Riqueza Lexical' or 'Estructura Sólida', max 4 words>",
    "content": "<detailed description in Spanish, why this is a strength, 2-3 sentences>",
    "category": "grammar" | "fluency" | "vocabulary" | "confidence" | "pronunciation"
  },
  "blocker": {
    "title": "<creative title in Spanish, e.g. 'Barreras de Fluidez' or 'Vacío Gramatical', max 4 words>",
    "content": "<detailed description in Spanish, what is holding them back, 2-3 sentences>",
    "category": "grammar" | "fluency" | "vocabulary" | "confidence" | "pronunciation"
  },
  "learningStyle": "<recommended learning approach in Spanish, 1 sentence>",
  "personalMessage": "<warm, honest feedback message in Spanish, 3-4 sentences>",
  "pronunciation": {
    "score": <0-100>,
    "accuracy": <0-100>,
    "fluency": <0-100>,
    "words": [ { "word": "word", "isHesitation": boolean, "isHighConfidence": boolean } ]
  },
  "blueprint": {
    "stopDoing": "<habit to stop, in Spanish, max 20 words>",
    "startDoing": "<action to start, in Spanish, max 20 words>",
    "focusFirst": "<priority area, in Spanish, max 20 words>"
  }
}

Respond ONLY with valid JSON. Everything in Spanish except categorical IDs.`;

    try {
        const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'You are an expert language assessment AI. Respond ONLY with valid JSON.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.8,
                max_tokens: 4000,
                response_format: { type: 'json_object' },
            }),
        });

        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        return res.status(response.status).json(content ? JSON.parse(content) : data);
    } catch (error) {
        console.error('Proxy analysis error:', error);
        return res.status(500).json({ error: 'Failed' });
    }
}

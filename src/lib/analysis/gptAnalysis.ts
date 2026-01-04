import { AzureOpenAI } from 'openai';
import type { CEFRLevel } from './types';

const client = new AzureOpenAI({
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
    apiVersion: '2024-08-01-preview',
    dangerouslyAllowBrowser: true, // For client-side usage
});

interface GPTAnalysisResult {
    estimatedLevel: CEFRLevel;
    percentile: number;
    strength: string;
    blocker: string;
    learningStyle: string;
    personalMessage: string;
    blueprint: {
        stopDoing: string;
        startDoing: string;
        focusFirst: string;
    };
}

export async function analyzeWithGPT(
    transcript: string,
    targetLanguage: string
): Promise<GPTAnalysisResult> {
    const prompt = `You are an expert language assessment AI specialized in evaluating second language proficiency. You are warm, encouraging, and honest.

Analyze the following text written by a learner of ${targetLanguage} as a second language.

TEXT TO ANALYZE:
"""
${transcript}
"""

Provide a comprehensive analysis in JSON format with the following structure:

{
  "estimatedLevel": "A2" | "B1" | "B1+" | "B2" | "C1" | "C2",
  "percentile": <number between 0-100>,
  "strength": "<one specific strength in Spanish, max 15 words>",
  "blocker": "<one main obstacle preventing progress in Spanish, max 15 words>",
  "learningStyle": "<recommended learning approach in Spanish, max 15 words>",
  "personalMessage": "<comprehensive, warm, honest feedback message in Spanish, 3-4 sentences>",
  "blueprint": {
    "stopDoing": "<specific habit to stop, personalized to this learner, in Spanish, max 20 words>",
    "startDoing": "<specific action to start, personalized to this learner, in Spanish, max 20 words>",
    "focusFirst": "<specific priority area, personalized to this learner, in Spanish, max 20 words>"
  }
}

ASSESSMENT CRITERIA:
1. **CEFR Level**: Evaluate based on:
   - Vocabulary range and sophistication
   - Grammatical accuracy and complexity
   - Sentence structure variety
   - Coherence and cohesion
   - Fluency indicators (if applicable)

2. **Percentile**: Estimate what percentage of ${targetLanguage} learners this person performs better than (0-100).

3. **Strength**: Identify ONE specific strength (e.g., "Vocabulario variado y expresivo", "Construcción de oraciones complejas").

4. **Blocker**: Identify ONE main obstacle (e.g., "Falta de vocabulario técnico y académico", "Estructura gramatical básica").

5. **Learning Style**: Recommend ONE specific learning approach (e.g., "Aprendizaje estructurado con práctica guiada", "Inmersión conversacional intensiva").

6. **Personal Message**: Write a warm, encouraging, and honest 3-4 sentence message that:
   - Acknowledges their current level positively
   - Highlights what they're doing well
   - Provides specific, actionable advice
   - Motivates them to continue learning
   - Uses a friendly, cercano tone (like talking to a friend)
   - Is written in Spanish

7. **Blueprint** - Personalized action plan based on THIS specific learner's text:
   - **stopDoing**: What specific habit or approach should they STOP doing? (e.g., "Depender de aplicaciones genéricas que tratan a todos los estudiantes igual", "Usar solo vocabulario básico por miedo a cometer errores")
   - **startDoing**: What specific action should they START doing? (e.g., "Aprender con contenido real conectado a tus metas profesionales o personales", "Practicar con textos auténticos de tu área de interés")
   - **focusFirst**: What should be their FIRST priority? (e.g., "Hablar de forma estructurada en situaciones realistas", "Ampliar vocabulario técnico en tu campo profesional")

IMPORTANT:
- Respond ONLY with valid JSON
- All text fields must be in Spanish
- Be specific and actionable
- Make blueprint items PERSONALIZED to this specific learner's text, not generic advice
- Keep each field concise (max words as specified)
- Percentile should reflect realistic distribution among language learners`;

    try {
        const response = await client.chat.completions.create({
            model: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert language assessment AI with a warm, encouraging personality. Always respond with valid JSON only.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7, // Higher temperature for more personalized messages
            max_tokens: 1000,
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from GPT');
        }

        const result = JSON.parse(content) as GPTAnalysisResult;

        // Validate the result
        if (!result.estimatedLevel || !result.percentile || !result.strength ||
            !result.blocker || !result.learningStyle || !result.personalMessage ||
            !result.blueprint?.stopDoing || !result.blueprint?.startDoing || !result.blueprint?.focusFirst) {
            throw new Error('Invalid GPT response structure');
        }

        return result;
    } catch (error) {
        console.error('GPT Analysis Error:', error);
        // Fallback to basic analysis if GPT fails
        throw error;
    }
}

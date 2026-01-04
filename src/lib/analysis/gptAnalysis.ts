import { AzureOpenAI } from 'openai';
import type { CEFRLevel } from './types';

const client = new AzureOpenAI({
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
    apiVersion: '2024-08-01-preview',
    dangerouslyAllowBrowser: true, // For client-side usage
});

export interface GPTAnalysisResult {
    estimatedLevel: CEFRLevel;
    percentile: number;
    strength: string;
    blocker: string;
    learningStyle: string;
    personalMessage: string;
    pronunciation?: {
        score: number;
        accuracy: number;
        fluency: number;
        words: Array<{
            word: string;
            startTime: number;
            endTime: number;
            isHesitation?: boolean;
            isHighConfidence?: boolean;
        }>;
    };
    blueprint: {
        stopDoing: string;
        startDoing: string;
        focusFirst: string;
    };
}

export async function analyzeWithGPT(
    transcript: string,
    targetLanguage: string,
    voiceData?: {
        duration: number;
        words: Array<{ word: string, start: number, end: number }>
    }
): Promise<GPTAnalysisResult> {
    const voiceContext = voiceData ? `
The text was provided via VOICE recording. 
- Total Duration: ${voiceData.duration}s
- Average Speed: ${(voiceData.words.length / (voiceData.duration / 60)).toFixed(1)} words per minute.
- Word timing details are available.

Evaluate the voice delivery:
1. Identify hesitations (long gaps > 1s).
2. Assess naturalness based on the word flow.
3. If the transcript contains phonetic inconsistencies or common non-native errors, highlight them.
` : '';

    const prompt = `You are an expert language assessment AI specialized in evaluating second language proficiency. You are warm, encouraging, and honest.

Analyze the following text written/spoken by a learner of ${targetLanguage} as a second language. ${voiceContext}

TEXT TO ANALYZE:
"""
${transcript}
"""

Provide a comprehensive analysis in JSON format with the following structure:

{
  "estimatedLevel": "A1" | "A2" | "B1" | "B1+" | "B2" | "C1" | "C2",
  "percentile": <number between 0-100>,
  "strength": "<one specific strength in Spanish, max 15 words>",
  "blocker": "<one main obstacle preventing progress in Spanish, max 15 words>",
  "learningStyle": "<recommended learning approach in Spanish, max 15 words>",
  "personalMessage": "<comprehensive, warm, honest feedback message in Spanish, 3-4 sentences>",
  "pronunciation": {
    "score": <overall value 0-100>,
    "accuracy": <0-100 value based on word correctness>,
    "fluency": <0-100 value based on flow and speed>,
    "words": [
       { "word": "word", "startTime": 0.0, "endTime": 0.1, "isHesitation": boolean, "isHighConfidence": boolean }
    ]
  },
  "blueprint": {
    "stopDoing": "<specific habit to stop, personalized to this learner, in Spanish, max 20 words>",
    "startDoing": "<specific action to start, personalized to this learner, in Spanish, max 20 words>",
    "focusFirst": "<specific priority area, personalized to this learner, in Spanish, max 20 words>"
  }
}

ASSESSMENT CRITERIA:
... (existing criteria) ...
7. **Pronunciation** (If voice context provided):
   - Use the word-level data to reconstruct the sequence.
   - Mark a word as "isHesitation: true" if there is a gap of > 1.2s before it.
   - Accuracy reflects how correct the words seem in context.
   - Fluency reflects the overall words per minute and rhythm.
   - If not a voice input, omit this field or return null.

IMPORTANT:
... (existing rules) ...
- For "words" in pronunciation, use the actual word list provided and preserve their timestamps.`;

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
            temperature: 0.7,
            max_tokens: 1500,
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from GPT');
        }

        const result = JSON.parse(content) as GPTAnalysisResult;

        // Populate word timestamps from original voiceData if available
        if (voiceData && result.pronunciation) {
            result.pronunciation.words = voiceData.words.map(vw => {
                const gptWord = result.pronunciation?.words.find(gw => gw.word.toLowerCase() === vw.word.toLowerCase());
                return {
                    word: vw.word,
                    startTime: vw.start,
                    endTime: vw.end,
                    isHesitation: gptWord?.isHesitation || false,
                    isHighConfidence: gptWord?.isHighConfidence !== undefined ? gptWord.isHighConfidence : true
                };
            });
        }

        return result;
    } catch (error) {
        console.error('GPT Analysis Error:', error);
        // Fallback to basic analysis if GPT fails
        throw error;
    }
}

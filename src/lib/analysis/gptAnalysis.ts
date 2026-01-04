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
    console.log('[GPT Analysis] Starting analysis with:', {
        transcriptLength: transcript.length,
        hasVoiceData: !!voiceData,
        voiceDuration: voiceData?.duration,
        wordCount: voiceData?.words.length
    });

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
       { "word": "word", "isHesitation": boolean, "isHighConfidence": boolean }
    ]
  },
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

7. **Pronunciation** (If voice context provided):
   - Use the word-level data to reconstruct the sequence.
   - Mark a word as "isHesitation: true" if there is a gap of > 1.2s before it.
   - Accuracy reflects how correct the words seem in context.
   - Fluency reflects the overall words per minute and rhythm.
   - If not a voice input, omit this field or return null.

IMPORTANT:
- Respond ONLY with valid JSON
- All text fields must be in Spanish
- Be specific and actionable
- Make blueprint items PERSONALIZED to this specific learner's text, not generic advice
- Keep each field concise (max words as specified)
- Percentile should reflect realistic distribution among language learners
- For "words" in pronunciation, use the actual word list provided and preserve their timestamps.`;

    try {
        const response = await client.chat.completions.create({
            model: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert language assessment AI. Respond ONLY with valid JSON. Be concise but thorough.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 4000, // Increased to handle long transcripts with word metadata
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            console.error('[GPT Analysis] Empty response content');
            throw new Error('No response from GPT');
        }

        console.log('[GPT Analysis] Raw response received, length:', content.length);

        let result: GPTAnalysisResult;
        try {
            result = JSON.parse(content) as GPTAnalysisResult;
        } catch (e) {
            console.error('[GPT Analysis] JSON Parse Error. First 100 chars:', content.substring(0, 100));
            console.error('[GPT Analysis] Last 100 chars:', content.substring(content.length - 100));
            throw e;
        }

        // Populate word timestamps from original voiceData if available
        if (voiceData && result.pronunciation) {
            console.log('[GPT Analysis] Mapping word timestamps for', voiceData.words.length, 'words');
            result.pronunciation.words = voiceData.words.map((vw, index) => {
                // Try to find the corresponding word in the GPT response
                // If GPT returned an array of the same length, we use index. 
                // Otherwise we search by word.
                const gptWord = result.pronunciation?.words[index] ||
                    result.pronunciation?.words.find(gw => gw.word.toLowerCase() === vw.word.toLowerCase());

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

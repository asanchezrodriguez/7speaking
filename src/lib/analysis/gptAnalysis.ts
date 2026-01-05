import type { CEFRLevel } from './types';

export interface GPTAnalysisResult {
    estimatedLevel: CEFRLevel;
    percentile: number;
    strength: {
        title: string;
        content: string;
        category: 'grammar' | 'fluency' | 'vocabulary' | 'confidence' | 'pronunciation';
    };
    blocker: {
        title: string;
        content: string;
        category: 'grammar' | 'fluency' | 'vocabulary' | 'confidence' | 'pronunciation';
    };
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
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transcript,
                targetLanguage,
                voiceData
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Analysis API Error:', error);
            throw new Error(`Failed to analyze text: ${response.statusText}`);
        }

        const result = await response.json() as GPTAnalysisResult;

        // Ensure word timestamps from original voiceData are preserved if available
        if (voiceData && result.pronunciation) {
            result.pronunciation.words = voiceData.words.map((vw, index) => {
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
        console.error('GPT Analysis Proxy Error:', error);
        throw error;
    }
}

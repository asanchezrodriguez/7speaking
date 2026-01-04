export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B1+' | 'B2' | 'C1' | 'C2';

export interface AnalysisMetrics {
    words: number;
    wpm: number;
    pauseRatio: number;
    fillerCount: number;
    uniqueWordRatio: number;
    avgSentenceLength: number;
    connectorScore: number;
    lexicalDiversity: number;
}

export interface AnalysisResult {
    sessionId: string;
    startedAt: string;
    utm: Record<string, string>;
    selectedIntent: string;
    inputMode: 'voice' | 'typing';
    transcript: string;
    metrics: AnalysisMetrics;
    estimatedLevel: CEFRLevel;
    percentile: number; // Percentile ranking (0-100)
    insights: {
        strength: string;
        blocker: string;
        learningStyle: string;
    };
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
    personalMessage?: string; // AI-generated comprehensive message
    blueprint: {
        stopDoing: string;
        startDoing: string;
        focusFirst: string;
    };
    recommendedNextStep: string;
}

export interface Blueprint {
    stopDoing: string;
    startDoing: string;
    focusFirst: string;
}

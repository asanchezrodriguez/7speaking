import type { AnalysisMetrics } from './types';

const SPANISH_FILLERS = [
    'eh', 'um', 'uh', 'este', 'pues', 'bueno', 'entonces',
    'o sea', 'como', 'digamos', 'emmm', 'ehhh', 'ajá', 'mmm'
];

const SPANISH_CONNECTORS = [
    'además', 'sin embargo', 'por lo tanto', 'aunque', 'porque',
    'mientras', 'cuando', 'si', 'pero', 'y', 'o', 'ni',
    'así que', 'por eso', 'en consecuencia', 'no obstante',
    'por otro lado', 'en cambio', 'en primer lugar', 'finalmente'
];

export function analyzeText(text: string, durationSeconds: number = 60): AnalysisMetrics {
    // Clean and normalize text
    const cleanText = text.trim().toLowerCase();

    // Word count
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Words per minute
    const wpm = durationSeconds > 0
        ? Math.round((wordCount / durationSeconds) * 60)
        : 0;

    // Filler words count
    const fillerCount = words.filter(word =>
        SPANISH_FILLERS.some(filler => word.includes(filler))
    ).length;

    // Unique words ratio
    const uniqueWords = new Set(words);
    const uniqueWordRatio = wordCount > 0
        ? uniqueWords.size / wordCount
        : 0;

    // Sentence analysis
    const sentences = cleanText
        .split(/[.!?]+/)
        .filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.length > 0
        ? wordCount / sentences.length
        : 0;

    // Connector score (complexity indicator)
    const connectorCount = words.filter(word =>
        SPANISH_CONNECTORS.includes(word)
    ).length;
    const connectorScore = wordCount > 0
        ? connectorCount / wordCount
        : 0;

    // Lexical diversity (Type-Token Ratio)
    const lexicalDiversity = uniqueWordRatio;

    // Pause ratio estimation (for voice input)
    // This is a simplified heuristic based on filler words
    const pauseRatio = wordCount > 0
        ? fillerCount / wordCount
        : 0;

    return {
        words: wordCount,
        wpm,
        pauseRatio,
        fillerCount,
        uniqueWordRatio,
        avgSentenceLength,
        connectorScore,
        lexicalDiversity,
    };
}

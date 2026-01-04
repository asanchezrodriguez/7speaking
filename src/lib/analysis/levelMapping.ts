import type { CEFRLevel, AnalysisMetrics } from './types';

/**
 * Maps analysis metrics to an estimated CEFR level using deterministic heuristics.
 * 
 * Scoring algorithm:
 * 1. WPM (Words Per Minute) - Primary indicator of fluency
 *    - A2: < 60 WPM
 *    - B1: 60-90 WPM
 *    - B1+: 90-110 WPM
 *    - B2: 110-140 WPM
 *    - C1: > 140 WPM
 * 
 * 2. Pause Ratio - Indicates hesitation (lower is better)
 *    - High pause ratio (>0.15) reduces level by one
 * 
 * 3. Lexical Diversity - Vocabulary range (higher is better)
 *    - Low diversity (<0.4) reduces level
 *    - High diversity (>0.6) can boost level
 * 
 * 4. Average Sentence Length - Complexity indicator
 *    - Short sentences (<8 words) suggests lower level
 *    - Longer sentences (>12 words) suggests higher level
 * 
 * 5. Connector Score - Use of discourse markers
 *    - Higher connector usage indicates better structure
 */
export function estimateCEFRLevel(metrics: AnalysisMetrics): CEFRLevel {
    let score = 0;

    // WPM scoring (0-4 points)
    if (metrics.wpm < 60) {
        score += 0; // A2
    } else if (metrics.wpm < 90) {
        score += 1; // B1
    } else if (metrics.wpm < 110) {
        score += 2; // B1+
    } else if (metrics.wpm < 140) {
        score += 3; // B2
    } else {
        score += 4; // C1
    }

    // Pause ratio adjustment (-1 to 0 points)
    if (metrics.pauseRatio > 0.15) {
        score -= 1;
    }

    // Lexical diversity adjustment (-0.5 to +0.5 points)
    if (metrics.lexicalDiversity < 0.4) {
        score -= 0.5;
    } else if (metrics.lexicalDiversity > 0.6) {
        score += 0.5;
    }

    // Sentence length adjustment (-0.5 to +0.5 points)
    if (metrics.avgSentenceLength < 8) {
        score -= 0.5;
    } else if (metrics.avgSentenceLength > 12) {
        score += 0.5;
    }

    // Connector score adjustment (0 to +0.5 points)
    if (metrics.connectorScore > 0.05) {
        score += 0.5;
    }

    // Map final score to CEFR level
    if (score < 0.5) return 'A2';
    if (score < 1.5) return 'B1';
    if (score < 2.5) return 'B1+';
    if (score < 3.5) return 'B2';
    return 'C1';
}

/**
 * Converts CEFR level to percentile ranking
 * Based on typical distribution of language learners
 */
export function levelToPercentile(level: CEFRLevel): number {
    const percentiles: Record<CEFRLevel, number> = {
        'A1': 15,
        'A2': 35,
        'B1': 50,
        'B1+': 65,
        'B2': 80,
        'C1': 90,
        'C2': 98,
    };
    return percentiles[level] || 50;
}

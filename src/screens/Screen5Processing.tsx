import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { analyzeText } from '../lib/analysis/textAnalysis';
import { estimateCEFRLevel, levelToPercentile } from '../lib/analysis/levelMapping';
import { generateInsights, generateBlueprint } from '../lib/analysis/insights';
import { analyzeWithGPT } from '../lib/analysis/gptAnalysis';
import { config } from '../config';
import { buildStoreUrlWithUTM } from '../lib/utils/utm';

export const Screen5Processing: React.FC = () => {
    const {
        nextScreen,
        transcript,
        audioDuration,
        sessionId,
        startedAt,
        utm,
        selectedIntent,
        selectedLanguage,
        inputMode,
        voiceData,
        setAnalysisResult
    } = useFlowStore();

    const [error, setError] = useState<string | null>(null);
    const analysisStarted = React.useRef(false);

    useEffect(() => {
        if (analysisStarted.current) return;
        analysisStarted.current = true;

        const processAnalysis = async () => {
            try {
                // Use GPT-4o for analysis
                const gptResult = await analyzeWithGPT(
                    transcript,
                    selectedLanguage || 'inglés',
                    voiceData || undefined
                );

                // Also get basic metrics for reference
                const metrics = analyzeText(transcript, audioDuration || 60);

                // Build result with GPT analysis (including personalized blueprint)
                const result = {
                    sessionId,
                    startedAt,
                    utm,
                    selectedIntent,
                    inputMode: inputMode || 'typing',
                    transcript,
                    metrics,
                    estimatedLevel: gptResult.estimatedLevel,
                    percentile: gptResult.percentile,
                    insights: {
                        strength: gptResult.strength,
                        blocker: gptResult.blocker,
                        learningStyle: gptResult.learningStyle,
                    },
                    pronunciation: gptResult.pronunciation,
                    personalMessage: gptResult.personalMessage,
                    blueprint: gptResult.blueprint, // AI-generated personalized blueprint
                    recommendedNextStep: buildStoreUrlWithUTM(config.storeUrl, utm),
                };

                setAnalysisResult(result);

                // Small delay to show the processing screen
                await new Promise(resolve => setTimeout(resolve, 1500));

                nextScreen();
            } catch (err) {
                console.error('Analysis error:', err);
                setError('Error al analizar. Usando análisis básico...');

                // Fallback to basic analysis after 2 seconds
                setTimeout(() => {
                    const metrics = analyzeText(transcript, audioDuration || 60);
                    const estimatedLevel = estimateCEFRLevel(metrics);
                    const insights = generateInsights(estimatedLevel, metrics);
                    const blueprint = generateBlueprint(estimatedLevel);
                    const percentile = levelToPercentile(estimatedLevel);

                    const result = {
                        sessionId,
                        startedAt,
                        utm,
                        selectedIntent,
                        inputMode: inputMode || 'typing',
                        transcript,
                        metrics,
                        estimatedLevel,
                        percentile,
                        insights,
                        personalMessage: 'Gracias por compartir tu texto. Continúa practicando para mejorar tus habilidades en el idioma.',
                        blueprint,
                        recommendedNextStep: buildStoreUrlWithUTM(config.storeUrl, utm),
                    };

                    setAnalysisResult(result);
                    nextScreen();
                }, 2000);
            }
        };

        processAnalysis();
    }, []);

    // Show different headline based on input mode
    const headline = inputMode === 'voice'
        ? copy.screen5.headlineVoice
        : copy.screen5.headlineTyping;

    return (
        <div className="text-center space-y-6">
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-intelixs-blue-500" />
            <div>
                <h2 className="text-3xl md:text-4xl font-semibold mb-3">
                    {headline}
                </h2>
                <p className="text-lg text-neutral-300">
                    {copy.screen5.subtext}
                </p>
                {error && (
                    <p className="text-sm text-yellow-400 mt-2">
                        {error}
                    </p>
                )}
            </div>
            <p className="text-sm text-neutral-500">
                {copy.screen5.footer}
            </p>
        </div>
    );
};

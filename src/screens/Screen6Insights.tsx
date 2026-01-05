import React from 'react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { XRayAnalysis } from '../components/XRayAnalysis';

export const Screen6Insights: React.FC = () => {
    const { nextScreen, analysisResult, selectedLanguage } = useFlowStore();

    if (!analysisResult) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-intelixs-blue-500"></div>
            </div>
        );
    }

    const { insights, percentile, personalMessage, pronunciation } = analysisResult;

    const languageName = (selectedLanguage || 'inglés').toLowerCase();

    return (
        <div className="space-y-8 max-w-3xl mx-auto pb-12">
            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    {copy.screen6.headline}
                </h2>
            </div>

            {/* X-Ray Analysis - WOW Effect */}
            {pronunciation && (
                <XRayAnalysis pronunciation={pronunciation} />
            )}

            {/* AI-Generated Personal Message - Highlighted */}
            {personalMessage && (
                <div className="bg-gradient-to-r from-intelixs-blue-500/10 to-intelixs-blue-600/10 border border-intelixs-blue-500/30 rounded-xl p-6">
                    <p className="text-lg leading-relaxed text-neutral-100">
                        {personalMessage}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-wide text-neutral-400">
                            TU NIVEL
                        </h3>
                        <p className="text-lg leading-relaxed">
                            Tus habilidades en <span className="text-intelixs-blue-400 font-semibold">{languageName}</span> son mejores que el <span className="text-intelixs-blue-400 font-semibold text-2xl">{percentile}%</span> de personas con {languageName} como segundo idioma.
                        </p>
                    </div>
                </Card>

                <Card>
                    <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-wide text-neutral-400">
                            {copy.screen6.blocks.strength}
                        </h3>
                        <p className="text-lg">
                            {insights.strength}
                        </p>
                    </div>
                </Card>

                <Card>
                    <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-wide text-neutral-400">
                            {copy.screen6.blocks.blocker}
                        </h3>
                        <p className="text-lg">
                            {insights.blocker}
                        </p>
                    </div>
                </Card>

                <Card>
                    <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-wide text-neutral-400">
                            {copy.screen6.blocks.learningStyle}
                        </h3>
                        <p className="text-lg">
                            {insights.learningStyle}
                        </p>
                    </div>
                </Card>
            </div>

            <p className="text-center text-lg text-neutral-300 italic">
                {copy.screen6.bridge}
            </p>

            <div className="flex justify-center pt-4">
                <Button
                    variant="primary"
                    onClick={nextScreen}
                    className="text-lg px-8 py-4"
                >
                    {copy.screen6.continueButton}
                </Button>
            </div>
        </div>
    );
};

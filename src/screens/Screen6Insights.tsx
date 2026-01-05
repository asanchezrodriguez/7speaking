import React from 'react';
import { Zap, Book, MessageCircle, Mic2, Star } from 'lucide-react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { XRayAnalysis } from '../components/XRayAnalysis';

const CategoryIcon = ({ category }: { category: string }) => {
    switch (category) {
        case 'grammar': return <Book className="text-intelixs-blue-400" size={18} />;
        case 'fluency': return <Zap className="text-yellow-400" size={18} />;
        case 'vocabulary': return <Star className="text-purple-400" size={18} />;
        case 'confidence': return <MessageCircle className="text-green-400" size={18} />;
        case 'pronunciation': return <Mic2 className="text-red-400" size={18} />;
        default: return <Zap className="text-intelixs-blue-400" size={18} />;
    }
};

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
                    <p className="text-lg leading-relaxed text-neutral-100 italic">
                        "{personalMessage}"
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="md:col-span-2">
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                            TU DESEMPEÑO GLOBAL
                        </h3>
                        <p className="text-lg leading-relaxed">
                            Tus habilidades en <span className="text-intelixs-blue-400 font-semibold">{languageName}</span> son mejores que el <span className="text-intelixs-blue-400 font-bold text-3xl">{percentile}%</span> de los estudiantes evaluados internacionalmente.
                        </p>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-green-500/50">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CategoryIcon category={insights.strength.category} />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-green-400">
                                {insights.strength.title}
                            </h3>
                        </div>
                        <p className="text-neutral-200 text-sm leading-relaxed">
                            {insights.strength.content}
                        </p>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-yellow-500/50">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CategoryIcon category={insights.blocker.category} />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-yellow-400">
                                {insights.blocker.title}
                            </h3>
                        </div>
                        <p className="text-neutral-200 text-sm leading-relaxed">
                            {insights.blocker.content}
                        </p>
                    </div>
                </Card>

                <Card className="md:col-span-2 bg-neutral-800/20">
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                            ESTILO DE APRENDIZAJE RECOMENDADO
                        </h3>
                        <p className="text-neutral-200">
                            {insights.learningStyle}
                        </p>
                    </div>
                </Card>
            </div>

            <p className="text-center text-lg text-neutral-300 italic px-4">
                {copy.screen6.bridge}
            </p>

            <div className="flex justify-center pt-4">
                <Button
                    variant="primary"
                    onClick={nextScreen}
                    className="text-lg px-8 py-4 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all"
                >
                    {copy.screen6.continueButton}
                </Button>
            </div>
        </div>
    );
};

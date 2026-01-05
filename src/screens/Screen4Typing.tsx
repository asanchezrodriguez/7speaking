import React, { useState } from 'react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';
import { config } from '../config';
import { analytics } from '../lib/analytics/tracker';

export const Screen4Typing: React.FC = () => {
    const { nextScreen, setTranscript, usage, selectedLanguage } = useFlowStore();
    const [text, setText] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const limitReached = usage.assessments >= 3;

    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const minWords = config.analysis.minWords;
    const canContinue = wordCount >= minWords && !limitReached;

    const handleContinue = () => {
        if (limitReached) return;
        if (!canContinue) {
            setShowWarning(true);
            return;
        }

        setTranscript(text);
        analytics.track('typing_input_completed', { wordCount });
        nextScreen();
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    {copy.screen4Typing.headline.replace('{language}', selectedLanguage.toLowerCase())}
                </h2>
            </div>

            <div className="space-y-4">
                <textarea
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        setShowWarning(false);
                    }}
                    placeholder={copy.screen4Typing.placeholder.replaceAll('{language}', selectedLanguage.toLowerCase())}
                    className="w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-intelixs-blue-500 focus:border-transparent resize-none"
                    autoFocus
                />

                <div className="flex justify-between items-center text-sm">
                    <span className={wordCount >= minWords ? 'text-green-400' : 'text-neutral-400'}>
                        {wordCount} palabras {wordCount >= minWords && '✓'}
                    </span>
                    <span className="text-neutral-500">
                        Mínimo: {minWords} palabras
                    </span>
                </div>

                {showWarning && (
                    <p className="text-red-400 text-sm text-center animate-fade-in">
                        {copy.screen4Typing.minWordsWarning}
                    </p>
                )}

                {limitReached && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                        <p className="text-red-400 text-sm">
                            Has alcanzado el límite de evaluaciones permitidas en esta sesión.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    variant="primary"
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className="text-lg px-8 py-4"
                >
                    {copy.screen4Typing.continueButton}
                </Button>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { ExternalLink, Mail } from 'lucide-react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';
import { analytics } from '../lib/analytics/tracker';

export const Screen10Conversion: React.FC = () => {
    const { nextScreen, analysisResult, setEmail } = useFlowStore();
    const [emailInput, setEmailInput] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);

    const handleStoreClick = () => {
        if (analysisResult) {
            analytics.track('store_cta_clicked', {
                level: analysisResult.estimatedLevel
            });
            window.open(analysisResult.recommendedNextStep, '_blank');
        }
    };

    const handleEmailSubmit = () => {
        setEmail(emailInput);
        setEmailSubmitted(true);
        analytics.track('email_captured', { email: emailInput });

        // Auto-advance after showing confirmation
        setTimeout(() => {
            nextScreen();
        }, 2000);
    };

    if (emailSubmitted) {
        return (
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="text-green-400 text-2xl">
                    ✓ {copy.screen10.emailSubmitted}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    {copy.screen10.headline}
                </h2>
                <p className="text-lg text-neutral-300">
                    {copy.screen10.body}
                </p>
            </div>

            <div className="space-y-4">
                <Button
                    variant="primary"
                    onClick={handleStoreClick}
                    className="w-full text-lg px-8 py-4 flex items-center justify-center gap-2"
                >
                    {copy.screen10.primaryCta}
                    <ExternalLink size={20} />
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-neutral-950 text-neutral-500">o</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder={copy.screen10.emailPlaceholder}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-intelixs-blue-500 focus:border-transparent"
                    />
                    <Button
                        variant="secondary"
                        onClick={handleEmailSubmit}
                        disabled={!emailInput.includes('@')}
                        className="flex items-center gap-2"
                    >
                        <Mail size={20} />
                        Enviar
                    </Button>
                </div>
            </div>

            <p className="text-sm text-neutral-400 text-center">
                {copy.screen10.microcopy}
            </p>

            <div className="flex justify-center pt-4">
                <Button
                    variant="ghost"
                    onClick={nextScreen}
                    className="text-sm"
                >
                    Continuar sin comprar →
                </Button>
            </div>
        </div>
    );
};

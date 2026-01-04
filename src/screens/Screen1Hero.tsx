import React from 'react';
import { Mic, Keyboard } from 'lucide-react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';
import { analytics } from '../lib/analytics/tracker';

export const Screen1Hero: React.FC = () => {
    const { setInputMode, setScreen } = useFlowStore();

    const handleVoiceClick = () => {
        setInputMode('voice');
        analytics.track('input_mode_selected', { mode: 'voice' });
        // Go directly to safety screen (Screen 3 naming, index 4 in App.tsx)
        setScreen(4);
    };

    const handleTypingClick = () => {
        setInputMode('typing');
        analytics.track('input_mode_selected', { mode: 'typing' });
        // Go directly to safety screen (Screen 3 naming, index 4 in App.tsx)
        setScreen(4);
    };

    return (
        <div className="flex items-center gap-6 max-w-7xl mx-auto">
            {/* Hero Image - Left side, bigger with stronger left fade */}
            <div className="hidden lg:block w-3/5 flex-shrink-0">
                <img
                    src="/hero-journey-begins.png"
                    alt="Tu viaje comienza"
                    className="w-full h-auto object-contain animate-fade-in"
                    style={{
                        maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.6) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.6) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)',
                        maskComposite: 'intersect',
                        WebkitMaskComposite: 'source-in',
                    }}
                />
            </div>

            {/* Content - Right side */}
            <div className="flex-1 text-center lg:text-left space-y-8">
                {/* Hero headline */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        {copy.screen1.headline}
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-300">
                        {copy.screen1.subheadline}
                    </p>
                </div>

                {/* CTAs - More compact */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center pt-4">
                    <Button
                        variant="primary"
                        onClick={handleVoiceClick}
                        className="w-full sm:w-auto px-6 py-3 flex items-center gap-2 whitespace-nowrap"
                    >
                        <Mic size={18} />
                        <span>{copy.screen1.primaryCta}</span>
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleTypingClick}
                        className="w-full sm:w-auto px-6 py-3 flex items-center gap-2 whitespace-nowrap"
                    >
                        <Keyboard size={18} />
                        <span>{copy.screen1.secondaryCta}</span>
                    </Button>
                </div>

                {/* Microcopy */}
                <p className="text-sm text-neutral-400 pt-4">
                    {copy.screen1.microcopy}
                </p>
            </div>
        </div>
    );
};

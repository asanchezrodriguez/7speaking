import React, { useState } from 'react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Card } from '../components/Card';
import { analytics } from '../lib/analytics/tracker';

export const Screen2Intent: React.FC = () => {
    const { nextScreen, setIntent } = useFlowStore();
    const [selected, setSelected] = useState<number | null>(null);

    const handleSelect = (index: number) => {
        setSelected(index);
        const intent = copy.screen2.options[index];
        setIntent(intent);
        analytics.track('intent_selected', { intent });

        // Auto-advance after short delay
        setTimeout(() => {
            nextScreen();
        }, 500);
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    {copy.screen2.prompt}
                </h2>
            </div>

            <div className="space-y-3">
                {copy.screen2.options.map((option, index) => (
                    <Card
                        key={index}
                        onClick={() => handleSelect(index)}
                        selected={selected === index}
                        className="text-left"
                    >
                        <p className="text-lg">{option}</p>
                    </Card>
                ))}
            </div>

            <p className="text-sm text-neutral-400 text-center">
                {copy.screen2.footer}
            </p>
        </div>
    );
};

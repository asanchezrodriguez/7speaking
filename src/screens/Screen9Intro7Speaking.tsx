import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';

export const Screen9Intro7Speaking: React.FC = () => {
    const { nextScreen } = useFlowStore();

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    {copy.screen9.headline}
                </h2>
                <p className="text-lg text-neutral-300">
                    {copy.screen9.body}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {copy.screen9.keyPoints.map((point, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 glass-effect rounded-lg p-4"
                    >
                        <CheckCircle2 className="text-intelixs-blue-500 flex-shrink-0" size={24} />
                        <span className="text-lg">{point}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    variant="primary"
                    onClick={nextScreen}
                    className="text-lg px-8 py-4"
                >
                    {copy.screen9.continueButton}
                </Button>
            </div>
        </div>
    );
};

import React from 'react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';

export const Screen7Reframe: React.FC = () => {
    const { nextScreen } = useFlowStore();

    return (
        <div className="text-center space-y-8 max-w-2xl mx-auto">
            <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    {copy.screen7.headline}
                </h2>
                <p className="text-lg text-neutral-300 leading-relaxed">
                    {copy.screen7.body}
                </p>
                <p className="text-2xl font-bold text-intelixs-blue-400">
                    {copy.screen7.boldLine}
                </p>
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    variant="primary"
                    onClick={nextScreen}
                    className="text-lg px-8 py-4"
                >
                    {copy.screen7.continueButton}
                </Button>
            </div>
        </div>
    );
};

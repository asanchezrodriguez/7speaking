import React from 'react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const Screen8Blueprint: React.FC = () => {
    const { nextScreen, analysisResult } = useFlowStore();

    if (!analysisResult) {
        return <div>Error: No analysis result available</div>;
    }

    const { blueprint } = analysisResult;

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    {copy.screen8.headline}
                </h2>
            </div>

            <div className="space-y-4">
                <Card>
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-intelixs-blue-400">
                            {copy.screen8.sections[0].title}
                        </h3>
                        <p className="text-lg text-neutral-300">
                            {blueprint.stopDoing}
                        </p>
                    </div>
                </Card>

                <Card>
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-intelixs-blue-400">
                            {copy.screen8.sections[1].title}
                        </h3>
                        <p className="text-lg text-neutral-300">
                            {blueprint.startDoing}
                        </p>
                    </div>
                </Card>

                <Card>
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-intelixs-blue-400">
                            {copy.screen8.sections[2].title}
                        </h3>
                        <p className="text-lg text-neutral-300">
                            {blueprint.focusFirst}
                        </p>
                    </div>
                </Card>
            </div>

            <p className="text-center text-lg text-neutral-300 italic">
                {copy.screen8.transition}
            </p>

            <div className="flex justify-center pt-4">
                <Button
                    variant="primary"
                    onClick={nextScreen}
                    className="text-lg px-8 py-4"
                >
                    {copy.screen8.continueButton}
                </Button>
            </div>
        </div>
    );
};

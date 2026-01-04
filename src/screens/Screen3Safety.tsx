import React from 'react';
import { Mic, Keyboard } from 'lucide-react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';

export const Screen3Safety: React.FC = () => {
    const { nextScreen, inputMode } = useFlowStore();

    return (
        <div className="text-center space-y-8 max-w-2xl mx-auto">
            {/* Headline */}
            <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                    {copy.screen3.headline}
                </h2>
                <p className="text-lg text-neutral-300">
                    {copy.screen3.body}
                </p>
            </div>

            {/* Instruction */}
            <div className="bg-intelixs-blue-500/10 border border-intelixs-blue-500/20 rounded-xl p-6">
                <p className="text-lg font-medium text-intelixs-blue-300">
                    {copy.screen3.instruction}
                </p>
            </div>

            {/* CTA - Show only the button for selected mode */}
            <div className="pt-4">
                {inputMode === 'voice' ? (
                    <Button
                        variant="primary"
                        onClick={nextScreen}
                        className="px-8 py-4 text-lg flex items-center gap-2 mx-auto"
                    >
                        <Mic size={20} />
                        {copy.screen3.primaryCta}
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={nextScreen}
                        className="px-8 py-4 text-lg flex items-center gap-2 mx-auto"
                    >
                        <Keyboard size={20} />
                        Empezar a escribir
                    </Button>
                )}
            </div>
        </div>
    );
};

import React from 'react';

interface ProgressIndicatorProps {
    currentStep: { full: string; short: string } | string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
    if (!currentStep) return null;

    const fullText = typeof currentStep === 'string' ? currentStep : currentStep.full;
    const shortText = typeof currentStep === 'string' ? currentStep : currentStep.short;

    return (
        <div className="w-full max-w-2xl mx-auto px-2">
            <div className="text-center">
                <p className="text-sm font-medium text-intelixs-blue-400">
                    <span className="hidden sm:inline">{fullText}</span>
                    <span className="inline sm:hidden">{shortText}</span>
                </p>
            </div>
        </div>
    );
};

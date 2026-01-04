import React from 'react';

interface ProgressIndicatorProps {
    currentStep: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
    if (!currentStep) return null;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-center">
                <p className="text-sm font-medium text-intelixs-blue-400">
                    {currentStep}
                </p>
            </div>
        </div>
    );
};

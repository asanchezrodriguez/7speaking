import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';

export const Screen0Preload: React.FC = () => {
    const { nextScreen } = useFlowStore();

    useEffect(() => {
        // Simulate preload time
        const timer = setTimeout(() => {
            nextScreen();
        }, 2000);

        return () => clearTimeout(timer);
    }, [nextScreen]);

    return (
        <div className="text-center space-y-6">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-intelixs-blue-500" />
            <div>
                <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                    {copy.screen0.title}
                </h1>
                <p className="text-neutral-400">
                    {copy.screen0.subtitle}
                </p>
            </div>
        </div>
    );
};

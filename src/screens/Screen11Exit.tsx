import React, { useState } from 'react';
import { Download, Copy, Check, ExternalLink } from 'lucide-react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';
import { downloadJSON, copyToClipboard } from '../lib/utils/export';
import { analytics } from '../lib/analytics/tracker';

export const Screen11Exit: React.FC = () => {
    const { analysisResult } = useFlowStore();
    const [copied, setCopied] = useState(false);

    if (!analysisResult) {
        return <div>Error: No analysis result available</div>;
    }

    const handleDownload = () => {
        downloadJSON(analysisResult);
        analytics.track('results_downloaded');
    };

    const handleCopy = () => {
        copyToClipboard(analysisResult);
        setCopied(true);
        analytics.track('results_copied');

        setTimeout(() => setCopied(false), 3000);
    };

    const handleVisitStore = () => {
        analytics.track('store_visit_from_exit');
        window.open(analysisResult.recommendedNextStep, '_blank');
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    {copy.screen11.headline}
                </h2>
                <p className="text-lg text-neutral-300">
                    {copy.screen11.body}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                    variant="secondary"
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 py-4"
                >
                    <Download size={20} />
                    {copy.screen11.downloadButton}
                </Button>

                <Button
                    variant="secondary"
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 py-4"
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? copy.screen11.copiedMessage : copy.screen11.copyButton}
                </Button>
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    variant="primary"
                    onClick={handleVisitStore}
                    className="flex items-center gap-2 text-lg px-8 py-4"
                >
                    {copy.screen11.visitStoreButton}
                    <ExternalLink size={20} />
                </Button>
            </div>
        </div>
    );
};

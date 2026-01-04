import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, AlertTriangle } from 'lucide-react';

interface XRayAnalysisProps {
    pronunciation: {
        score: number;
        accuracy: number;
        fluency: number;
        words: Array<{
            word: string;
            startTime: number;
            endTime: number;
            isHesitation?: boolean;
            isHighConfidence?: boolean;
        }>;
    };
}

export const XRayAnalysis: React.FC<XRayAnalysisProps> = ({ pronunciation }) => {
    const { score, accuracy, fluency, words } = pronunciation;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-8 bg-neutral-900/50 border border-intelixs-blue-500/20 rounded-3xl p-8 backdrop-blur-md"
        >
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                        <Activity className="text-intelixs-blue-500" />
                        Intelixs Voice X-Ray™
                    </h3>
                    <p className="text-neutral-400">Análisis biomecánico y lingüístico de tu habla.</p>
                </div>

                <div className="flex gap-4">
                    <ScoreCard label="Puntaje" value={score} color="text-intelixs-blue-500" />
                    <ScoreCard label="Precisión" value={accuracy} color="text-emerald-500" />
                    <ScoreCard label="Fluidez" value={fluency} color="text-amber-500" />
                </div>
            </div>

            {/* Transcript Visualization */}
            <div className="relative p-6 bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-intelixs-blue-500/5 to-transparent pointer-events-none" />

                <div className="flex flex-wrap gap-x-2 gap-y-3 relative z-10">
                    {words.map((w, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className={`
                                relative px-2 py-1 rounded-md text-lg transition-all cursor-default group
                                ${w.isHesitation ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-neutral-300'}
                                ${w.isHighConfidence === false ? 'underline decoration-red-500/50 decoration-wavy' : ''}
                            `}
                        >
                            {w.word}

                            {/* Hover Tooltip/Detail */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-neutral-800 text-xs text-white rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                {w.startTime.toFixed(2)}s - {w.endTime.toFixed(2)}s
                                {w.isHesitation && <span className="block text-amber-400">Pausa detectada</span>}
                            </div>
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Insights Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                    <Zap className="text-emerald-500 shrink-0 mt-1" size={18} />
                    <div className="text-sm">
                        <span className="font-semibold block mb-1 text-emerald-400">Patrón de Éxito</span>
                        <p className="text-neutral-400">Tu cadencia en las oraciones complejas demuestra una fuerte internalización de las estructuras gramaticales.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                    <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={18} />
                    <div className="text-sm">
                        <span className="font-semibold block mb-1 text-amber-400">Área de Optimización</span>
                        <p className="text-neutral-400">Detectamos vacilación al conectar ideas abstractas. Enfócate en conectores lógicos para ganar fluidez.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ScoreCard = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="text-center p-3 px-6 bg-white/5 rounded-2xl border border-white/5 min-w-[100px]">
        <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">{label}</span>
        <span className={`text-2xl font-bold ${color}`}>{value}%</span>
    </div>
);

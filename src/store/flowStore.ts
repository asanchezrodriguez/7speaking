import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalysisResult } from '../lib/analysis/types';
import { extractUTMParams } from '../lib/utils/utm';

interface FlowState {
    // Navigation
    currentScreen: number;

    // Session data
    sessionId: string;
    startedAt: string;
    utm: Record<string, string>;

    // User inputs
    selectedIntent: string;
    selectedLanguage: string;
    selectedLanguageFlag: string;
    inputMode: 'voice' | 'typing' | null;
    transcript: string;
    audioDuration: number;

    // Analysis results
    analysisResult: AnalysisResult | null;

    // Email capture
    email: string;

    // Actions
    setScreen: (screen: number) => void;
    nextScreen: () => void;
    previousScreen: () => void;
    setIntent: (intent: string) => void;
    setLanguage: (language: string) => void;
    setLanguageFlag: (flag: string) => void;
    setInputMode: (mode: 'voice' | 'typing') => void;
    setTranscript: (transcript: string) => void;
    setAudioDuration: (duration: number) => void;
    setAnalysisResult: (result: AnalysisResult) => void;
    setEmail: (email: string) => void;
    reset: () => void;
}

const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const useFlowStore = create<FlowState>()(
    persist(
        (set) => ({
            // Initial state
            currentScreen: 0,
            sessionId: generateSessionId(),
            startedAt: new Date().toISOString(),
            utm: extractUTMParams(),
            selectedIntent: '',
            selectedLanguage: '',
            selectedLanguageFlag: '',
            inputMode: null,
            transcript: '',
            audioDuration: 0,
            analysisResult: null,
            email: '',

            // Actions
            setScreen: (screen) => set({ currentScreen: screen }),

            nextScreen: () => set((state) => ({
                currentScreen: Math.min(state.currentScreen + 1, 13)
            })),

            previousScreen: () => set((state) => ({
                currentScreen: Math.max(state.currentScreen - 1, 0)
            })),

            setIntent: (intent) => set({ selectedIntent: intent }),

            setLanguage: (language) => set({ selectedLanguage: language }),

            setLanguageFlag: (flag) => set({ selectedLanguageFlag: flag }),

            setInputMode: (mode) => set({ inputMode: mode }),

            setTranscript: (transcript) => set({ transcript }),

            setAudioDuration: (duration) => set({ audioDuration: duration }),

            setAnalysisResult: (result) => set({ analysisResult: result }),

            setEmail: (email) => set({ email }),

            reset: () => set({
                currentScreen: 0,
                sessionId: generateSessionId(),
                startedAt: new Date().toISOString(),
                utm: extractUTMParams(),
                selectedIntent: '',
                selectedLanguage: '',
                selectedLanguageFlag: '',
                inputMode: null,
                transcript: '',
                audioDuration: 0,
                analysisResult: null,
                email: '',
            }),
        }),
        {
            name: 'intelixs-flow-storage',
            partialize: (state) => ({
                sessionId: state.sessionId,
                startedAt: state.startedAt,
                utm: state.utm,
                selectedIntent: state.selectedIntent,
                selectedLanguage: state.selectedLanguage,
                selectedLanguageFlag: state.selectedLanguageFlag,
                inputMode: state.inputMode,
                transcript: state.transcript,
                analysisResult: state.analysisResult,
            }),
        }
    )
);

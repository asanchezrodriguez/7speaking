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
    voiceData: {
        duration: number;
        words: Array<{ word: string, start: number, end: number }>;
    } | null;

    // Analysis results
    analysisResult: AnalysisResult | null;

    // Email capture
    email: string;

    // Security & Usage
    usage: {
        recordings: number;
        assessments: number;
        assistantMessages: number;
    };

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
    setVoiceData: (data: { duration: number; words: Array<{ word: string, start: number, end: number }> } | null) => void;
    setAnalysisResult: (result: AnalysisResult) => void;
    setEmail: (email: string) => void;

    // Usage Actions
    incrementUsage: (type: 'recordings' | 'assessments' | 'assistantMessages') => void;
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
            voiceData: null,
            analysisResult: null,
            email: '',
            usage: {
                recordings: 0,
                assessments: 0,
                assistantMessages: 0,
            },

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
            setVoiceData: (data) => set({ voiceData: data }),
            setAnalysisResult: (result) => set({ analysisResult: result }),

            setEmail: (email) => set({ email }),

            incrementUsage: (type) => set((state) => ({
                usage: {
                    ...state.usage,
                    [type]: state.usage[type] + 1
                }
            })),

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
                voiceData: null,
                analysisResult: null,
                email: '',
                usage: {
                    recordings: 0,
                    assessments: 0,
                    assistantMessages: 0,
                },
            }),
        }),
        {
            name: 'intelixs-flow-storage',
            partialize: (state) => ({
                currentScreen: state.currentScreen,
                usage: state.usage,
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

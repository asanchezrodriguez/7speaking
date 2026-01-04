export const config = {
    // Feature flags
    features: {
        voiceInput: true,
        typingInput: true,
        analytics: true,
    },

    // Store URL from environment
    storeUrl: import.meta.env.VITE_STORE_URL || 'https://store.intelixs.com/7speaking',

    // Voice recording settings
    voice: {
        maxDurationSeconds: 60,
        language: 'es-ES',
    },

    // Analysis settings
    analysis: {
        minWords: 30,
        processingDelayMs: 3000, // Simulated processing time
    },
} as const;

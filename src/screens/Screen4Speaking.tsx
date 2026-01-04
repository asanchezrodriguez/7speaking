import React, { useState, useEffect, useRef } from 'react';
import { MicOff, Loader2 } from 'lucide-react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';
import { VoiceRecorder } from '../lib/voice/recorder';
import { AzureWhisperService } from '../lib/voice/azureWhisper';
import { config } from '../config';
import { analytics } from '../lib/analytics/tracker';

export const Screen4Speaking: React.FC = () => {
    const { nextScreen, setTranscript, setAudioDuration, setInputMode, setVoiceData, usage, incrementUsage } = useFlowStore();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingLimitReached, setRecordingLimitReached] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(config.voice.maxDurationSeconds);
    const [showHelper, setShowHelper] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isTranscribing, setIsTranscribing] = useState(false);

    const recorderRef = useRef<VoiceRecorder | null>(null);
    const whisperService = useRef(new AzureWhisperService());
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Initialize recorder
        recorderRef.current = new VoiceRecorder();

        // Request microphone permission and start recording
        const initRecording = async () => {
            // Check limits
            if (usage.recordings >= 3) {
                setRecordingLimitReached(true);
                setIsInitializing(false);
                return;
            }

            try {
                const hasPermission = await recorderRef.current!.requestPermission();
                if (!hasPermission) {
                    setError(copy.screen4Speaking.micPermissionDenied);
                    setIsInitializing(false);
                    return;
                }

                // Start recording
                await recorderRef.current!.startRecording();

                setIsRecording(true);
                setIsInitializing(false);
                analytics.track('voice_recording_started');

                // Start timer
                timerRef.current = setInterval(() => {
                    setTimeLeft((prev: number) => {
                        if (prev <= 1) {
                            if (timerRef.current) clearInterval(timerRef.current);
                            handleStop('timeout');
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                // Show helper after 10 seconds
                setTimeout(() => setShowHelper(true), 10000);
            } catch (err) {
                console.error('Recording error:', err);
                setError(copy.screen4Speaking.micPermissionError);
                setIsInitializing(false);
            }
        };

        initRecording();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (recorderRef.current) recorderRef.current.cleanup();
        };
    }, []);

    const handleStop = async (reason: 'manual' | 'timeout' = 'manual') => {
        if (!isRecording || isTranscribing) return;

        setIsRecording(false);
        setIsTranscribing(true);

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        try {
            // Get final audio and duration
            const duration = recorderRef.current?.stopRecording() || 0;

            // Wait for the dataavailable event to finish
            await new Promise(resolve => setTimeout(resolve, 500));

            const audioBlob = recorderRef.current!.getAudioBlob();

            // Transcribe with Azure Whisper
            const whisperResult = await whisperService.current.transcribe(audioBlob);

            setTranscript(whisperResult.text);
            setAudioDuration(duration);
            setVoiceData({
                duration: whisperResult.duration,
                words: whisperResult.words.map(w => ({
                    word: w.word,
                    start: w.start,
                    end: w.end
                }))
            });

            analytics.track('voice_recording_completed', {
                duration,
                transcriptLength: whisperResult.text.length,
                reason
            });

            incrementUsage('recordings');
            // Move to processing screen
            nextScreen();
        } catch (err) {
            console.error('Transcription error:', err);
            setError('Error al procesar tu voz. Por favor intenta de nuevo.');
            setIsTranscribing(false);
        }
    };

    const handleSwitchToTyping = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (recorderRef.current) recorderRef.current.cleanup();

        setInputMode('typing');
        analytics.track('switched_to_typing_from_voice');
        nextScreen();
    };

    if (error) {
        return (
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="text-red-400 text-lg">{error}</div>
                <Button onClick={handleSwitchToTyping}>
                    {copy.screen4Speaking.switchToTyping}
                </Button>
            </div>
        );
    }

    if (recordingLimitReached) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                    <MicOff size={32} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Límite de grabaciones alcanzado</h2>
                    <p className="text-neutral-400 max-w-sm">
                        Has superado el número máximo de intentos de grabación permitidos en esta sesión para proteger la calidad del servicio.
                    </p>
                </div>
                <Button onClick={() => setInputMode('typing')}>
                    Usar modo texto en su lugar
                </Button>
            </div>
        );
    }

    if (isInitializing) {
        return (
            <div className="text-center space-y-6">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-intelixs-blue-500" />
                <p className="text-neutral-400">Preparando micrófono...</p>
            </div>
        );
    }

    if (isTranscribing) {
        return (
            <div className="text-center space-y-6">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-intelixs-blue-500" />
                <p className="text-xl font-medium text-white">Analizando tu voz...</p>
                <p className="text-neutral-400">Generando tu radiografía de pronunciación.</p>
            </div>
        );
    }

    return (
        <div className="text-center space-y-8 max-w-2xl mx-auto">
            {/* Timer */}
            <div className="space-y-4">
                <div className="text-6xl md:text-7xl font-bold text-intelixs-blue-500 tabular-nums">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-lg text-neutral-300">
                    {copy.screen4Speaking.guidance}
                </p>
            </div>

            {/* Waveform visualization (simplified) */}
            <div className="flex justify-center items-center gap-2 h-24">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 bg-intelixs-blue-500 rounded-full animate-pulse"
                        style={{
                            height: `${30 + Math.random() * 40}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '0.8s',
                        }}
                    />
                ))}
            </div>

            {/* Helper text */}
            {showHelper && (
                <p className="text-intelixs-blue-400 animate-fade-in">
                    {copy.screen4Speaking.helper}
                </p>
            )}

            {/* Stop button */}
            <div className="pt-4">
                <Button
                    variant="secondary"
                    onClick={() => handleStop('manual')}
                    className="text-lg px-8 py-4 flex items-center gap-2 mx-auto"
                >
                    <MicOff size={20} />
                    {copy.screen4Speaking.stopButton}
                </Button>
            </div>

            {/* Privacy notice */}
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
                {copy.screen4Speaking.privacy}
            </p>
        </div>
    );
};

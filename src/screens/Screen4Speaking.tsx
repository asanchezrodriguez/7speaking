import React, { useState, useEffect, useRef } from 'react';
import { MicOff, Loader2 } from 'lucide-react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';
import { VoiceRecorder } from '../lib/voice/recorder';
import { SpeechTranscriber } from '../lib/voice/transcription';
import { config } from '../config';
import { analytics } from '../lib/analytics/tracker';

export const Screen4Speaking: React.FC = () => {
    const { nextScreen, setTranscript, setAudioDuration, setInputMode } = useFlowStore();
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(config.voice.maxDurationSeconds);
    const [showHelper, setShowHelper] = useState(false);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    const recorderRef = useRef<VoiceRecorder | null>(null);
    const transcriberRef = useRef<SpeechTranscriber | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Initialize recorder and transcriber
        recorderRef.current = new VoiceRecorder();
        transcriberRef.current = new SpeechTranscriber();

        // Check if speech recognition is supported
        if (!transcriberRef.current.isSupported()) {
            console.warn('Speech recognition not supported, transcript will be empty');
        }

        // Request microphone permission and start recording
        const initRecording = async () => {
            try {
                const hasPermission = await recorderRef.current!.requestPermission();
                if (!hasPermission) {
                    setError(copy.screen4Speaking.micPermissionDenied);
                    setIsInitializing(false);
                    return;
                }

                // Start recording
                await recorderRef.current!.startRecording();

                // Start transcription if supported
                if (transcriberRef.current!.isSupported()) {
                    transcriberRef.current!.start(
                        (text) => setCurrentTranscript(text),
                        (err) => console.error('Transcription error:', err)
                    );
                }

                setIsRecording(true);
                setIsInitializing(false);
                analytics.track('voice_recording_started');

                // Start timer
                timerRef.current = setInterval(() => {
                    setTimeLeft((prev: number) => {
                        if (prev <= 1) {
                            handleStop();
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
            if (transcriberRef.current) transcriberRef.current.stop();
        };
    }, []);

    const handleStop = () => {
        if (!isRecording) return;

        setIsRecording(false);

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        const duration = recorderRef.current?.stopRecording() || 0;
        const finalTranscript = transcriberRef.current?.stop() || currentTranscript;

        setTranscript(finalTranscript);
        setAudioDuration(duration);

        analytics.track('voice_recording_completed', {
            duration,
            transcriptLength: finalTranscript.length
        });

        // Move to processing screen
        nextScreen();
    };

    const handleSwitchToTyping = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (recorderRef.current) recorderRef.current.cleanup();
        if (transcriberRef.current) transcriberRef.current.stop();

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

    if (isInitializing) {
        return (
            <div className="text-center space-y-6">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-intelixs-blue-500" />
                <p className="text-neutral-400">Preparando micrófono...</p>
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
                    onClick={handleStop}
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

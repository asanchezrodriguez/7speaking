import { config } from '../../config';

export class SpeechTranscriber {
    private recognition: SpeechRecognition | null = null;
    private transcript: string = '';

    constructor() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new (window as any).webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new (window as any).SpeechRecognition();
        }

        if (this.recognition) {
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = config.voice.language;
        }
    }

    isSupported(): boolean {
        return this.recognition !== null;
    }

    start(onTranscript: (text: string) => void, onError?: (error: Error) => void): void {
        if (!this.recognition) {
            if (onError) {
                onError(new Error('Speech recognition not supported'));
            }
            return;
        }

        this.transcript = '';

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            this.transcript += finalTranscript;
            const fullTranscript = this.transcript + interimTranscript;
            onTranscript(fullTranscript);
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            if (onError) {
                onError(new Error(event.error));
            }
        };

        this.recognition.start();
    }

    stop(): string {
        if (this.recognition) {
            this.recognition.stop();
        }
        return this.transcript;
    }

    getTranscript(): string {
        return this.transcript;
    }
}

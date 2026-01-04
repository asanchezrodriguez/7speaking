
export class VoiceRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private stream: MediaStream | null = null;
    private startTime: number = 0;

    async requestPermission(): Promise<boolean> {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            return false;
        }
    }

    async startRecording(onDataAvailable?: (blob: Blob) => void): Promise<void> {
        if (!this.stream) {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                throw new Error('Microphone permission denied');
            }
        }

        this.audioChunks = [];
        this.startTime = Date.now();

        this.mediaRecorder = new MediaRecorder(this.stream!);

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.audioChunks.push(event.data);
            }
        };

        this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            if (onDataAvailable) {
                onDataAvailable(audioBlob);
            }
        };

        this.mediaRecorder.start();
    }

    stopRecording(): number {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        const duration = (Date.now() - this.startTime) / 1000;
        return duration;
    }

    getAudioBlob(): Blob {
        return new Blob(this.audioChunks, { type: 'audio/webm' });
    }

    cleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        this.mediaRecorder = null;
        this.audioChunks = [];
    }

    getDuration(): number {
        if (this.startTime === 0) return 0;
        return (Date.now() - this.startTime) / 1000;
    }
}

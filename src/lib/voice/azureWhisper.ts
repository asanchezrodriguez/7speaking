export interface WhisperWord {
    word: string;
    start: number;
    end: number;
}

export interface WhisperResponse {
    text: string;
    task: string;
    language: string;
    duration: number;
    words: WhisperWord[];
}

export class AzureWhisperService {
    async transcribe(audioBlob: Blob): Promise<WhisperResponse> {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('response_format', 'verbose_json');
        formData.append('timestamp_granularities[]', 'word');

        const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Whisper API Error:', error);
            throw new Error(`Failed to transcribe audio: ${response.statusText}`);
        }

        return await response.json();
    }
}

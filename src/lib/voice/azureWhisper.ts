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
    private endpoint: string;
    private apiKey: string;
    private deployment: string;
    private apiVersion: string;

    constructor() {
        this.endpoint = import.meta.env.VITE_AZURE_WHISPER_ENDPOINT;
        this.apiKey = import.meta.env.VITE_AZURE_WHISPER_KEY;
        this.deployment = import.meta.env.VITE_AZURE_WHISPER_DEPLOYMENT;
        this.apiVersion = import.meta.env.VITE_AZURE_WHISPER_API_VERSION;
    }

    async transcribe(audioBlob: Blob): Promise<WhisperResponse> {
        if (!this.apiKey || !this.endpoint) {
            throw new Error('Azure Whisper configuration missing');
        }

        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('response_format', 'verbose_json');
        formData.append('timestamp_granularities[]', 'word');

        // Note: The endpoint provided by the user might need adjustment depending on if it's 
        // a Cognitive Services endpoint or an OpenAI-specific one.
        // Assuming Cognitive Services REST API for Whisper:
        const url = `${this.endpoint}/openai/deployments/${this.deployment}/audio/transcriptions?api-version=${this.apiVersion}`;

        console.log('[Azure Whisper] Starting transcription...', {
            audioSize: audioBlob.size,
            audioType: audioBlob.type
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'api-key': this.apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('[Azure Whisper] API Error:', {
                status: response.status,
                text: response.statusText,
                body: error
            });
            throw new Error(`Failed to transcribe audio: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[Azure Whisper] Transcription completed successfully');
        return data;
    }
}

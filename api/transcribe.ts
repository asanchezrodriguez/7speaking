export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const rawEndpoint = process.env.AZURE_WHISPER_ENDPOINT;
    const apiKey = process.env.AZURE_WHISPER_KEY;
    const deployment = process.env.AZURE_WHISPER_DEPLOYMENT;
    const apiVersion = process.env.AZURE_WHISPER_API_VERSION || '2024-06-01';

    if (!rawEndpoint || !apiKey || !deployment) {
        return new Response(JSON.stringify({ error: 'Azure Whisper configuration missing on server' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Clean endpoint to avoid double slashes
    const endpoint = rawEndpoint.endsWith('/') ? rawEndpoint.slice(0, -1) : rawEndpoint;

    try {
        const url = `${endpoint}/openai/deployments/${deployment}/audio/transcriptions?api-version=${apiVersion}`;

        // Forward the request body stream and the Content-Type header (important for multipart boundary)
        const proxyResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'Content-Type': req.headers.get('Content-Type') || 'multipart/form-data',
            },
            body: req.body,
        });

        const data = await proxyResponse.json();
        return new Response(JSON.stringify(data), {
            status: proxyResponse.status,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Edge Proxy transcription error:', error);
        return new Response(JSON.stringify({ error: 'Failed to proxy transcription request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

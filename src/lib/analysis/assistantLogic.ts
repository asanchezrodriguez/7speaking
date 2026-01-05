export interface AssistantMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function getAssistantResponse(messages: AssistantMessage[], selectedLanguage: string = 'inglés'): Promise<string> {
    try {
        const response = await fetch('/api/assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                selectedLanguage
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Assistant API Error:', error);
            throw new Error(`Failed to get assistant response: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Assistant Proxy Error:', error);
        return "Hubo un error al conectar con el asistente. Por favor, intenta de nuevo.";
    }
}

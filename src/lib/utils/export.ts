import type { AnalysisResult } from '../analysis/types';

export function downloadJSON(data: AnalysisResult, filename: string = 'intelixs-results.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function copyToClipboard(data: AnalysisResult): string {
    const summary = `
INTELIXS LANGUAGE INTELLIGENCE - RESULTADOS

Nivel Estimado: ${data.estimatedLevel}
Fortaleza: ${data.insights.strength}
Principal Bloqueo: ${data.insights.blocker}
Estilo de Aprendizaje: ${data.insights.learningStyle}

TU CAMINO MÁS RÁPIDO:

Qué dejar de hacer:
${data.blueprint.stopDoing}

Qué empezar a hacer:
${data.blueprint.startDoing}

En qué enfocarte primero:
${data.blueprint.focusFirst}

---
Métricas:
- Palabras: ${data.metrics.words}
- Palabras por minuto: ${data.metrics.wpm}
- Diversidad léxica: ${(data.metrics.lexicalDiversity * 100).toFixed(1)}%
- Longitud promedio de oraciones: ${data.metrics.avgSentenceLength.toFixed(1)} palabras

Sesión ID: ${data.sessionId}
Fecha: ${new Date(data.startedAt).toLocaleDateString('es-ES')}

Continúa tu aprendizaje: ${data.recommendedNextStep}
  `.trim();

    navigator.clipboard.writeText(summary);
    return summary;
}

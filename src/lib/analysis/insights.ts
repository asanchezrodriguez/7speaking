import type { CEFRLevel, AnalysisMetrics } from './types';

interface Insights {
    strength: string;
    blocker: string;
    learningStyle: string;
}

export function generateInsights(
    level: CEFRLevel,
    metrics: AnalysisMetrics
): Insights {
    // Determine strength based on best metric
    let strength = 'Comprensión de ideas y contexto';

    if (metrics.lexicalDiversity > 0.6) {
        strength = 'Vocabulario variado y expresivo';
    } else if (metrics.connectorScore > 0.06) {
        strength = 'Estructura y organización del discurso';
    } else if (metrics.wpm > 100) {
        strength = 'Fluidez al expresar ideas';
    }

    // Determine blocker based on weakest metric
    let blocker = 'Confianza al hablar bajo presión real';

    if (metrics.pauseRatio > 0.15) {
        blocker = 'Vacilación y pausas frecuentes';
    } else if (metrics.lexicalDiversity < 0.4) {
        blocker = 'Rango limitado de vocabulario';
    } else if (metrics.avgSentenceLength < 8) {
        blocker = 'Construcción de oraciones complejas';
    } else if (metrics.wpm < 70) {
        blocker = 'Velocidad y automatización del habla';
    }

    // Determine learning style based on level and metrics
    let learningStyle = 'Orientado a metas y aprendizaje contextual';

    if (level === 'A2' || level === 'B1') {
        learningStyle = 'Aprendizaje estructurado con práctica guiada';
    } else if (level === 'B1+' || level === 'B2') {
        learningStyle = 'Orientado a metas y aprendizaje contextual';
    } else {
        learningStyle = 'Aprendizaje autónomo con desafíos reales';
    }

    return {
        strength,
        blocker,
        learningStyle,
    };
}

export function generateBlueprint(level: CEFRLevel) {
    const blueprints: Record<CEFRLevel, { stopDoing: string; startDoing: string; focusFirst: string }> = {
        A1: {
            stopDoing: 'Intentar aprender reglas gramaticales aisladas',
            startDoing: 'Familiarizarte con sonidos y vocabulario básico cotidiano',
            focusFirst: 'Saludarse y presentarse de forma natural',
        },
        A2: {
            stopDoing: 'Depender de traducciones palabra por palabra',
            startDoing: 'Practicar frases completas en contextos cotidianos',
            focusFirst: 'Conversaciones básicas sobre temas familiares',
        },
        B1: {
            stopDoing: 'Depender de aplicaciones genéricas que tratan a todos los estudiantes igual',
            startDoing: 'Aprender con contenido real conectado a tus metas profesionales o personales',
            focusFirst: 'Hablar de forma estructurada en situaciones realistas',
        },
        'B1+': {
            stopDoing: 'Evitar situaciones que te saquen de tu zona de confort',
            startDoing: 'Exponerte a conversaciones espontáneas y temas complejos',
            focusFirst: 'Expresar opiniones y argumentar con claridad',
        },
        B2: {
            stopDoing: 'Conformarte con comunicación funcional básica',
            startDoing: 'Participar en discusiones profesionales y académicas',
            focusFirst: 'Precisión en vocabulario técnico y matices del idioma',
        },
        C1: {
            stopDoing: 'Practicar solo con ejercicios controlados',
            startDoing: 'Involucrarte en debates complejos y presentaciones formales',
            focusFirst: 'Refinamiento estilístico y adaptación a differentes registros',
        },
        C2: {
            stopDoing: 'Dejar de practicar por sentir que ya dominas el idioma',
            startDoing: 'Perfeccionar matices culturales y sutilezas lingüísticas extremas',
            focusFirst: 'Fluidez nativa y dominio total de contextos complejos',
        },
    };

    return blueprints[level];
}

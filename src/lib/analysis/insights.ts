import type { CEFRLevel, AnalysisMetrics } from './types';

interface Insights {
    strength: {
        title: string;
        content: string;
        category: 'grammar' | 'fluency' | 'vocabulary' | 'confidence' | 'pronunciation';
    };
    blocker: {
        title: string;
        content: string;
        category: 'grammar' | 'fluency' | 'vocabulary' | 'confidence' | 'pronunciation';
    };
    learningStyle: string;
}

export function generateInsights(
    level: CEFRLevel,
    metrics: AnalysisMetrics
): Insights {
    // Determine strength based on best metric
    let strengthTitle = 'Comprensión Lectora';
    let strengthContent = 'Demuestras una buena capacidad para entender el contexto y las ideas principales.';
    let strengthCategory: 'grammar' | 'fluency' | 'vocabulary' | 'confidence' | 'pronunciation' = 'confidence';

    if (metrics.lexicalDiversity > 0.6) {
        strengthTitle = 'Riqueza de Vocabulario';
        strengthContent = 'Tu uso de términos específicos y variados permite una comunicación más precisa.';
        strengthCategory = 'vocabulary';
    } else if (metrics.connectorScore > 0.06) {
        strengthTitle = 'Estructura Lógica';
        strengthContent = 'Organizas tus ideas de forma coherente, facilitando el seguimiento de tu discurso.';
        strengthCategory = 'grammar';
    } else if (metrics.wpm > 100) {
        strengthTitle = 'Fluidez Natural';
        strengthContent = 'Mantienes un ritmo constante que facilita la interacción espontánea.';
        strengthCategory = 'fluency';
    }

    // Determine blocker based on weakest metric
    let blockerTitle = 'Barreras de Confianza';
    let blockerContent = 'La duda al hablar limita tu capacidad para expresar ideas más abstractas.';
    let blockerCategory: 'grammar' | 'fluency' | 'vocabulary' | 'confidence' | 'pronunciation' = 'confidence';

    if (metrics.pauseRatio > 0.15) {
        blockerTitle = 'Pausas Frequentadas';
        blockerContent = 'Las interrupciones en el flujo de voz afectan la claridad de tu mensaje.';
        blockerCategory = 'fluency';
    } else if (metrics.lexicalDiversity < 0.4) {
        blockerTitle = 'Vocabulario Limitado';
        blockerContent = 'Dependes de palabras básicas, lo que impide profundizar en temas complejos.';
        blockerCategory = 'vocabulary';
    } else if (metrics.avgSentenceLength < 8) {
        blockerTitle = 'Longitud de Oración';
        blockerContent = 'Tus frases cortas limitan la sofisticación de tu comunicación.';
        blockerCategory = 'grammar';
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
        strength: {
            title: strengthTitle,
            content: strengthContent,
            category: strengthCategory
        },
        blocker: {
            title: blockerTitle,
            content: blockerContent,
            category: blockerCategory
        },
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

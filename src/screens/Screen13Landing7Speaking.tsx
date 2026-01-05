import React from 'react';
import { CheckCircle2, Globe, Zap, Users, ArrowRight } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const Screen13Landing7Speaking: React.FC = () => {
    const { setScreen, analysisResult } = useFlowStore();

    const handleBack = () => {
        if (analysisResult) {
            setScreen(7); // Go to Insights
        } else {
            setScreen(2); // Go to Hero
        }
    };

    return (
        <div className="space-y-12 max-w-5xl mx-auto pb-12">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-[1.2] pb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                    La Experiencia 7Speaking
                </h1>
                <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                    Más que una plataforma de idiomas, una solución integral para el crecimiento profesional y la comunicación global.
                </p>
                <div className="flex justify-center pt-4">
                    <Button variant="primary" onClick={handleBack} className="text-lg px-8 py-4 flex items-center gap-2">
                        {analysisResult ? 'Volver a mis resultados' : 'Comenzar mi viaje'}
                        <ArrowRight size={20} />
                    </Button>
                </div>
            </section>

            {/* Pillars Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 space-y-4 border-intelixs-blue-500/20">
                    <div className="w-12 h-12 bg-intelixs-blue-500/10 rounded-xl flex items-center justify-center text-intelixs-blue-400">
                        <Globe size={28} />
                    </div>
                    <h3 className="text-xl font-bold">Contenido Real</h3>
                    <p className="text-neutral-400 leading-relaxed">
                        Noticias diarias y contenidos auténticos de tu sector profesional. Aprende con lo que importa hoy.
                    </p>
                </Card>

                <Card className="p-8 space-y-4 border-intelixs-blue-500/20">
                    <div className="w-12 h-12 bg-intelixs-blue-500/10 rounded-xl flex items-center justify-center text-intelixs-blue-400">
                        <Zap size={28} />
                    </div>
                    <h3 className="text-xl font-bold">Micro-learning</h3>
                    <p className="text-neutral-400 leading-relaxed">
                        Lecciones cortas y efectivas diseñadas para personas con poco tiempo. 15 minutos al día son suficientes.
                    </p>
                </Card>

                <Card className="p-8 space-y-4 border-intelixs-blue-500/20">
                    <div className="w-12 h-12 bg-intelixs-blue-500/10 rounded-xl flex items-center justify-center text-intelixs-blue-400">
                        <Users size={28} />
                    </div>
                    <h3 className="text-xl font-bold">Enfoque Humano</h3>
                    <p className="text-neutral-400 leading-relaxed">
                        Simulaciones de situaciones reales y feedback personalizado potenciado por IA y expertos.
                    </p>
                </Card>
            </section>

            {/* Corporate Features */}
            <section className="glass-effect rounded-2xl p-10 space-y-8 border border-white/5">
                <h2 className="text-3xl font-bold text-center">Diseñado para el Éxito Corporativo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                    {[
                        'Integración con LMS/LXP corporativos',
                        'Soporte para SSO (Okta, Azure, Google)',
                        'Reportes de progreso y KPIs detallados',
                        'Rutas personalizadas por rol y nivel',
                        'Certificaciones alineadas al MCER',
                        'Acceso offline y modo móvil total'
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="text-intelixs-blue-500 flex-shrink-0" size={22} />
                            <span className="text-lg text-neutral-200">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Social Proof */}
            <section className="text-center space-y-8">
                <h3 className="text-sm uppercase tracking-widest text-neutral-500">CONFIADO POR LÍDERES GLOBALES</h3>
                <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* We can add logos here later if needed, but for now just a summary */}
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto italic">
                        "7Speaking nos ha permitido escalar el entrenamiento de idiomas con resultados medibles en la operación."
                    </p>
                </div>
            </section>

            <div className="flex justify-center">
                <Button variant="ghost" onClick={handleBack} className="text-neutral-400">
                    ← Volver atrás
                </Button>
            </div>
        </div>
    );
};

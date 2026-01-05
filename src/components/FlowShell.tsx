import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, MessageSquare, Menu, X } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';
import { ProgressIndicator } from './ProgressIndicator';
import { Button } from './Button';
import { ContactModal } from './ContactModal';
import { InfoModal } from './InfoModal';
import { copy } from '../content/copy-es';
import { config } from '../config';
import { AIAssistant } from './AIAssistant';

interface FlowShellProps {
    children: React.ReactNode;
    showProgress?: boolean;
    showBack?: boolean;
    progressStep?: { full: string; short: string } | string;
}

export const FlowShell: React.FC<FlowShellProps> = ({
    children,
    showProgress = true,
    showBack = true,
    progressStep,
}) => {
    const { currentScreen, previousScreen, setScreen, selectedLanguage, selectedLanguageFlag } = useFlowStore();
    const [showContactModal, setShowContactModal] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [activeInfoSection, setActiveInfoSection] = React.useState<'about' | 'universities' | 'companies' | null>(null);

    // Don't show back button on first screens or processing screen
    const canGoBack = showBack && currentScreen > 2 && currentScreen !== 6;

    const navLinks = [
        { key: 'about', label: 'Quiénes Somos' },
        { key: 'universities', label: 'Para Universidades' },
        { key: 'companies', label: 'Para Empresas' },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
            {/* Ambient background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-intelixs-blue-900/20 via-neutral-950 to-neutral-950" />

            {/* Subtle animated background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-intelixs-blue-500/10 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-intelixs-blue-600/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>

            {/* Cinematic bokeh lights */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-yellow-400/40 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-300/30 rounded-full blur-xl" />
                <div className="absolute top-2/3 left-1/5 w-40 h-40 bg-amber-400/35 rounded-full blur-3xl" />
                <div className="absolute top-1/4 left-1/3 w-28 h-28 bg-blue-400/30 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/6 w-36 h-36 bg-cyan-300/25 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-blue-300/35 rounded-full blur-xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header with logo, progress, and shop icon */}
                <div className="pt-6 px-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        {/* Logo & Burger */}
                        <div className="flex-1 flex items-center gap-3">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors relative z-50 text-neutral-400"
                                aria-label="Menú"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <button
                                onClick={() => {
                                    if (useFlowStore.getState().analysisResult) {
                                        setScreen(13);
                                    } else {
                                        setScreen(2);
                                    }
                                    setIsMenuOpen(false);
                                }}
                                className="transition-transform active:scale-95 focus:outline-none"
                            >
                                <img
                                    src="/intelixs_logo_nb.png"
                                    alt="Intelixs"
                                    className="h-8 md:h-10"
                                />
                            </button>
                        </div>

                        {/* Progress indicator - center (optimizado para mobile en su propio componente) */}
                        {showProgress && progressStep && (
                            <div className="flex-1 flex justify-center">
                                <ProgressIndicator currentStep={progressStep} />
                            </div>
                        )}

                        <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4">
                            {/* Language indicator */}
                            {currentScreen > 1 && selectedLanguageFlag && (
                                <button
                                    onClick={() => setScreen(1)}
                                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group lg:flex hidden"
                                    title="Cambiar idioma"
                                >
                                    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-500 group-hover:text-neutral-300">
                                        Idioma:
                                    </span>
                                    <img
                                        src={selectedLanguageFlag}
                                        alt={selectedLanguage}
                                        className="w-5 sm:w-6 h-3 sm:h-4 object-cover rounded-sm"
                                    />
                                </button>
                            )}

                            <a
                                href={config.storeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 sm:px-3 py-2 rounded-lg hover:bg-intelixs-blue-500/10 transition-colors flex items-center gap-2 group"
                                aria-label="Tienda en línea"
                            >
                                <span className="text-sm font-medium text-neutral-400 group-hover:text-intelixs-blue-400 transition-colors hidden lg:inline">
                                    Tienda
                                </span>
                                <ShoppingBag className="w-5 h-5 text-intelixs-blue-500" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Mobile/Hamburger Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-0 z-40 pt-20 pb-6 px-6 bg-neutral-950/95 backdrop-blur-xl md:w-96 border-r border-white/10"
                        >
                            <nav className="flex flex-col gap-5">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.key}
                                        onClick={() => {
                                            setActiveInfoSection(link.key as any);
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-lg font-medium text-neutral-300 hover:text-intelixs-blue-400 text-left transition-colors"
                                    >
                                        {link.label}
                                    </button>
                                ))}
                                <div className="h-px bg-white/10 my-1" />
                                <a
                                    href={config.storeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lg font-medium text-neutral-300 hover:text-intelixs-blue-400 flex items-center gap-3 transition-colors"
                                >
                                    Tienda en línea <ShoppingBag className="w-5 h-5 text-intelixs-blue-500" />
                                </a>
                                {currentScreen > 1 && selectedLanguageFlag && (
                                    <button
                                        onClick={() => {
                                            setScreen(1);
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-base text-neutral-500 hover:text-neutral-300 flex items-center gap-2 transition-colors mt-2"
                                    >
                                        Cambiar idioma ({selectedLanguage})
                                        <img src={selectedLanguageFlag} alt="" className="w-5 h-3.5 rounded-sm" />
                                    </button>
                                )}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back button */}
                {canGoBack && (
                    <div className="px-4 pt-2">
                        <Button
                            variant="ghost"
                            onClick={previousScreen}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft size={16} />
                            {copy.common.back}
                        </Button>
                    </div>
                )}

                {/* Main content area */}
                <div className="flex-1 flex items-center justify-center px-4 py-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentScreen}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="w-full max-w-4xl"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer with contact button */}
                <div className="pb-6 px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-4">
                        <Button
                            variant="ghost"
                            onClick={() => setShowContactModal(true)}
                            className="flex items-center gap-2 mx-auto"
                        >
                            <MessageSquare size={18} />
                            Contáctanos o pide una demo
                        </Button>
                        <p className="text-xs text-neutral-500">
                            Intelixs, socio oficial de 7Speaking para LATAM, Brasil, EEUU y Canadá
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Modals */}
            {activeInfoSection && (
                <InfoModal
                    isOpen={!!activeInfoSection}
                    onClose={() => setActiveInfoSection(null)}
                    title={copy.infoSections[activeInfoSection].title}
                    content={copy.infoSections[activeInfoSection].content}
                />
            )}

            {/* Contact Modal */}
            <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />

            {/* AI Assistant */}
            <AIAssistant />
        </div>
    );
};

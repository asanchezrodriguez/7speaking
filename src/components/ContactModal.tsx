import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { copy } from '../content/copy-es';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Google Apps Script URL from old webpage
            const scriptUrl = 'https://script.google.com/macros/s/AKfycbwYOUR_SCRIPT_ID/exec';

            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            setSubmitStatus('success');
            setTimeout(() => {
                onClose();
                setFormData({ name: '', email: '', phone: '', company: '', message: '' });
                setSubmitStatus('idle');
            }, 2000);
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl p-6 shadow-2xl border border-neutral-800">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                    aria-label="Cerrar"
                >
                    <X size={20} className="text-neutral-400" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{copy.contactModal.title}</h2>
                    <p className="text-neutral-400">{copy.contactModal.subtitle}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-intelixs-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-intelixs-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-intelixs-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-2">
                            Empresa/Institución
                        </label>
                        <input
                            type="text"
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-intelixs-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                            Mensaje *
                        </label>
                        <textarea
                            id="message"
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-intelixs-blue-500 resize-none"
                        />
                    </div>

                    {submitStatus === 'success' && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                            ¡Mensaje enviado! Te contactaremos pronto.
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            Hubo un error. Por favor intenta de nuevo.
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? 'Enviando...' : copy.contactModal.submitButton}
                    </Button>
                </form>
            </div>
        </div>
    );
};

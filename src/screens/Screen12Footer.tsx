import React from 'react';
import { copy } from '../content/copy-es';

export const Screen12Footer: React.FC = () => {
    return (
        <div className="space-y-6 max-w-2xl mx-auto text-center">
            <p className="text-neutral-400">
                {copy.screen12.statement}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
                {copy.screen12.links.map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        className="text-neutral-400 hover:text-white transition-colors"
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            <div className="pt-8 text-sm text-neutral-600">
                © {new Date().getFullYear()} Intelixs. Todos los derechos reservados.
            </div>
        </div>
    );
};

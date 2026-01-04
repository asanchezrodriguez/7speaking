import React from 'react';
import { copy } from '../content/copy-es';
import { useFlowStore } from '../store/flowStore';
import { Card } from '../components/Card';

export const Screen0_5LanguageSelection: React.FC = () => {
    const { nextScreen, setLanguage, setLanguageFlag } = useFlowStore();
    const [selected, setSelected] = React.useState<string | null>(null);

    const handleSelect = (languageCode: string, languageName: string, flag: string) => {
        setSelected(languageCode);
        setLanguage(languageName);
        setLanguageFlag(flag);
        // Advance after short delay
        setTimeout(() => {
            nextScreen();
        }, 500);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold">
                    {copy.screen0_5.headline}
                </h1>
                <p className="text-lg text-neutral-300">
                    {copy.screen0_5.subheadline}
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {copy.screen0_5.languages.map((language) => (
                    <Card
                        key={language.code}
                        onClick={() => handleSelect(language.code, language.name, language.flag)}
                        selected={selected === language.code}
                        className="text-center cursor-pointer hover:scale-105 transition-transform"
                    >
                        <div className="flex flex-col items-center gap-3 py-2">
                            <img
                                src={language.flag}
                                alt={language.name}
                                className="w-16 h-12 object-cover rounded"
                            />
                            <span className="text-lg font-medium">{language.name}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

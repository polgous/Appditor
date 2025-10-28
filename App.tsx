
import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ReportDisplay from './components/ReportDisplay';
import { generateInstagramReport } from './services/geminiService';
import type { InstagramReport } from './types';

const App: React.FC = () => {
    const [report, setReport] = useState<InstagramReport | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = async (profileUrl: string) => {
        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            const result = await generateInstagramReport(profileUrl);
            setReport(result);
        } catch (err) {
            console.error(err);
            setError('Hubo un error al generar el informe. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-primary flex flex-col items-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-4xl mx-auto">
                <Header />
                <main className="mt-8">
                    <InputForm onSubmit={handleGenerateReport} isLoading={isLoading} />
                    <div className="mt-12">
                        <ReportDisplay report={report} isLoading={isLoading} error={error} />
                    </div>
                </main>
            </div>
            <footer className="w-full max-w-4xl mx-auto text-center py-6 mt-12 text-brand-subtle text-sm">
                <p>Potenciado por Gemini AI. Creado para estrategas y diseñadores.</p>
            </footer>
        </div>
    );
};

export default App;
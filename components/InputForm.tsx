
import React, { useState } from 'react';

interface InputFormProps {
    onSubmit: (url: string) => void;
    isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [url, setUrl] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const validateUrl = (url: string): boolean => {
        const instagramUrlRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}\/?$/i;
        return instagramUrlRegex.test(url);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!url.trim()) {
            setError('Por favor, introduce una URL de perfil de Instagram.');
            return;
        }

        if (!validateUrl(url)) {
            setError('El formato de la URL no es válido. Ejemplo: https://instagram.com/usuario');
            return;
        }
        
        onSubmit(url);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-brand-secondary p-2 rounded-xl shadow-lg">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        if (error) {
                            setError(null);
                        }
                    }}
                    placeholder="Ej: https://instagram.com/usuario"
                    className={`w-full flex-grow bg-transparent text-brand-text placeholder-brand-subtle py-3 px-4 focus:outline-none rounded-lg ${error ? 'ring-2 ring-red-500' : ''}`}
                    disabled={isLoading}
                    aria-invalid={!!error}
                    aria-describedby="url-error"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-brand-accent hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Analizando...' : 'Generar Informe'}
                </button>
            </div>
             {error && (
                <p id="url-error" className="text-red-400 text-sm mt-2 text-center sm:text-left sm:ml-4" role="alert">
                    {error}
                </p>
            )}
        </form>
    );
};

export default InputForm;

import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="text-center p-8">
            <div className="flex justify-center items-center space-x-2">
                <div className="w-4 h-4 rounded-full animate-pulse bg-brand-accent"></div>
                <div className="w-4 h-4 rounded-full animate-pulse bg-brand-accent" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 rounded-full animate-pulse bg-brand-accent" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="mt-4 text-brand-subtle">Generando informe experto, por favor espera...</p>
        </div>
    );
};

export default LoadingSpinner;

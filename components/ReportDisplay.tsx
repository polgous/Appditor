import React from 'react';
import type { InstagramReport, Evaluation } from '../types';
import LoadingSpinner from './LoadingSpinner';
import AnalyzeIcon from './icons/AnalyzeIcon';
import BulbIcon from './icons/BulbIcon';
import ChecklistIcon from './icons/ChecklistIcon';
import ExportButton from './ExportButton';
import CheckCircleIcon from './icons/CheckCircleIcon';
import EyeIcon from './icons/EyeIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import IdCardIcon from './icons/IdCardIcon';
import GridIcon from './icons/GridIcon';
import StarIcon from './icons/StarIcon';

interface ReportDisplayProps {
    report: InstagramReport | null;
    isLoading: boolean;
    error: string | null;
}

const EvaluationIcon: React.FC<{ evaluation: Evaluation; className?: string }> = ({ evaluation, className = "h-8 w-8" }) => {
    switch (evaluation) {
        case 'good':
            return <CheckCircleIcon className={`${className} text-green-400`} />;
        case 'review':
            return <EyeIcon className={`${className} text-yellow-400`} />;
        case 'change':
            return <AlertTriangleIcon className={`${className} text-red-400`} />;
        default:
            return null;
    }
};

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, isLoading, error }) => {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="text-center text-brand-subtle p-8 border-2 border-dashed border-brand-secondary rounded-xl">
                <p>El informe de auditoría aparecerá aquí una vez generado.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in">
             <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-3xl font-bold text-brand-text">Resumen Ejecutivo</h2>
                    <p className="text-brand-subtle mt-1">Una vista rápida de los puntos clave del perfil.</p>
                 </div>
                <ExportButton report={report} />
            </div>
            
            {/* Profile Summary Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {report.profileSummary.map((item, index) => (
                    <div key={index} className="bg-brand-secondary p-6 rounded-xl shadow-md flex flex-col items-center text-center">
                        <EvaluationIcon evaluation={item.evaluation} className="h-10 w-10 mb-4" />
                        <h3 className="font-semibold text-lg mb-2 text-brand-text">{item.topic}</h3>
                        <p className="text-brand-subtle text-sm flex-grow">{item.summary}</p>
                    </div>
                ))}
            </section>

             {/* Key Elements Section */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-brand-secondary p-3 rounded-full"><IdCardIcon /></div>
                    <h2 className="text-3xl font-bold text-brand-accent">Valoración de Elementos Clave</h2>
                </div>
                <div className="space-y-6">
                    {[
                        { key: 'username', title: 'Nombre de Usuario' },
                        { key: 'profileName', title: 'Nombre de Perfil' },
                        { key: 'profilePicture', title: 'Foto de Perfil' },
                        { key: 'biography', title: 'Biografía' },
                        { key: 'bioLink', title: 'Enlace en la Biografía' }
                    ].map(({ key, title }) => (
                        <div key={key} className="bg-brand-secondary p-6 rounded-xl shadow-md">
                            <h3 className="font-semibold text-lg mb-2">{title}</h3>
                            <p className="text-brand-subtle">{report.audit.keyElements[key as keyof typeof report.audit.keyElements]}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Post Analysis Section */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-brand-secondary p-3 rounded-full"><GridIcon /></div>
                    <h2 className="text-3xl font-bold text-brand-accent">Análisis de Publicaciones</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold text-green-400 mb-4">✅ Ejemplos a seguir</h3>
                        <div className="space-y-6">
                            {report.audit.postAnalysis.bestPosts.map((post, index) => (
                                <div key={`best-${index}`} className="bg-brand-secondary p-6 rounded-xl shadow-md border-l-4 border-green-400">
                                    <p className="text-brand-text font-semibold italic">"{post.description}"</p>
                                    <p className="text-brand-subtle mt-2"><strong className="text-brand-text">Por qué funciona:</strong> {post.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-red-400 mb-4">❌ Ejemplos a evitar</h3>
                        <div className="space-y-6">
                            {report.audit.postAnalysis.worstPosts.map((post, index) => (
                                <div key={`worst-${index}`} className="bg-brand-secondary p-6 rounded-xl shadow-md border-l-4 border-red-400">
                                    <p className="text-brand-text font-semibold italic">"{post.description}"</p>
                                    <p className="text-brand-subtle mt-2"><strong className="text-brand-text">Qué evitar:</strong> {post.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* General Audit Section */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-brand-secondary p-3 rounded-full"><AnalyzeIcon /></div>
                    <h2 className="text-3xl font-bold text-brand-accent">Auditoría General</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-brand-secondary p-6 rounded-xl shadow-md">
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><StarIcon className="w-5 h-5 text-brand-accent" /> Análisis de Destacados</h3>
                        <p className="text-brand-subtle mt-2">{report.audit.highlightsAnalysis}</p>
                    </div>
                    <div className="bg-brand-secondary p-6 rounded-xl shadow-md">
                        <h3 className="font-semibold text-lg mb-2">Estrategia de Contenido</h3>
                        <p className="text-brand-subtle">{report.audit.contentStrategy}</p>
                    </div>
                    <div className="bg-brand-secondary p-6 rounded-xl shadow-md">
                        <h3 className="font-semibold text-lg mb-2">Estética Visual</h3>
                        <p className="text-brand-subtle">{report.audit.visualAesthetics}</p>
                    </div>
                    <div className="bg-brand-secondary p-6 rounded-xl shadow-md">
                        <h3 className="font-semibold text-lg mb-2">Análisis de Engagement</h3>
                        <p className="text-brand-subtle">{report.audit.engagementAnalysis}</p>
                    </div>
                </div>
            </section>

            {/* Recommendations Section */}
            <section>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="bg-brand-secondary p-3 rounded-full"><BulbIcon /></div>
                    <h2 className="text-3xl font-bold text-brand-accent">Recomendaciones Clave</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Victorias Rápidas (Quick Wins)</h3>
                        <ul className="space-y-3">
                            {report.recommendations.quickWins.map((win, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <p className="text-brand-subtle">{win}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Cambios Estratégicos</h3>
                        <ul className="space-y-3">
                            {report.recommendations.strategicChanges.map((change, index) => (
                                <li key={index} className="flex items-start gap-3">
                                     <span className="text-yellow-400 mt-1">➤</span>
                                    <p className="text-brand-subtle">{change}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            
            {/* Action Plan Section */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-brand-secondary p-3 rounded-full"><ChecklistIcon /></div>
                    <h2 className="text-3xl font-bold text-brand-accent">Plan de Acción</h2>
                </div>
                <div className="space-y-4">
                    {report.recommendations.actionPlan.map((item) => (
                         <div key={item.step} className="bg-brand-secondary p-4 rounded-lg flex items-center gap-4 shadow-sm">
                           <div className="flex-shrink-0 bg-brand-accent text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                               {item.step}
                           </div>
                           <p className="text-brand-text">{item.action}</p>
                       </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ReportDisplay;
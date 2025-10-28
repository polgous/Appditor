import React from 'react';
import type { InstagramReport } from '../types';
import DownloadIcon from './icons/DownloadIcon';

interface ExportButtonProps {
    report: InstagramReport;
}

const ExportButton: React.FC<ExportButtonProps> = ({ report }) => {

    const getEvaluationEmoji = (evaluation: string): string => {
        switch (evaluation) {
            case 'good': return '✅';
            case 'review': return '👀';
            case 'change': return '⚠️';
            default: return '➡️';
        }
    };

    const generateMarkdown = (reportData: InstagramReport): string => {
        let markdown = `# Informe de Auditoría de Instagram\n\n`;

        // Profile Summary Section
        markdown += `## Resumen Ejecutivo\n\n`;
        reportData.profileSummary.forEach(item => {
            markdown += `### ${getEvaluationEmoji(item.evaluation)} ${item.topic}\n`;
            markdown += `${item.summary}\n\n`;
        });

        // Key Elements Section
        markdown += `## Valoración de Elementos Clave\n\n`;
        markdown += `### Nombre de Usuario\n${reportData.audit.keyElements.username}\n\n`;
        markdown += `### Nombre de Perfil\n${reportData.audit.keyElements.profileName}\n\n`;
        markdown += `### Foto de Perfil\n${reportData.audit.keyElements.profilePicture}\n\n`;
        markdown += `### Biografía\n${reportData.audit.keyElements.biography}\n\n`;
        markdown += `### Enlace en la Biografía\n${reportData.audit.keyElements.bioLink}\n\n`;

        // Post Analysis Section
        markdown += `## Análisis de Publicaciones\n\n`;
        markdown += `### ✅ Mejores Publicaciones\n\n`;
        reportData.audit.postAnalysis.bestPosts.forEach(post => {
            markdown += `* **Descripción:** ${post.description}\n`;
            markdown += `  * **Razón:** ${post.reason}\n\n`;
        });
        markdown += `### ❌ Peores Publicaciones\n\n`;
        reportData.audit.postAnalysis.worstPosts.forEach(post => {
            markdown += `* **Descripción:** ${post.description}\n`;
            markdown += `  * **Razón:** ${post.reason}\n\n`;
        });

        // Audit Section
        markdown += `## Auditoría General\n\n`;
        markdown += `### Análisis de Destacados\n${reportData.audit.highlightsAnalysis}\n\n`;
        markdown += `### Estrategia de Contenido\n${reportData.audit.contentStrategy}\n\n`;
        markdown += `### Estética Visual\n${reportData.audit.visualAesthetics}\n\n`;
        markdown += `### Análisis de Engagement\n${reportData.audit.engagementAnalysis}\n\n`;

        // Recommendations Section
        markdown += `## Recomendaciones Clave\n\n`;
        markdown += `### Victorias Rápidas (Quick Wins)\n`;
        reportData.recommendations.quickWins.forEach(win => {
            markdown += `* ${win}\n`;
        });
        markdown += `\n`;

        markdown += `### Cambios Estratégicos\n`;
        reportData.recommendations.strategicChanges.forEach(change => {
            markdown += `* ${change}\n`;
        });
        markdown += `\n`;

        // Action Plan Section
        markdown += `## Plan de Acción\n\n`;
        reportData.recommendations.actionPlan
            .sort((a, b) => a.step - b.step) // Ensure order
            .forEach(item => {
                markdown += `${item.step}. ${item.action}\n`;
            });

        return markdown;
    };

    const handleExport = () => {
        const markdownContent = generateMarkdown(report);
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'informe-instagram.md';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-brand-secondary hover:bg-slate-600 text-brand-subtle font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            aria-label="Exportar informe como Markdown"
        >
            <DownloadIcon />
            Exportar
        </button>
    );
};

export default ExportButton;
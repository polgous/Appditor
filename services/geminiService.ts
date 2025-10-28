import { GoogleGenAI, Type } from "@google/genai";
import type { InstagramReport, Audit, Recommendations, ProfileSummaryItem, KeyElementEvaluation, PostAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const parseJsonResponse = <T,>(text: string): T | null => {
    try {
        const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse JSON:", e);
        console.error("Raw text:", text);
        return null;
    }
};

export const generateInstagramReport = async (profileUrl: string): Promise<InstagramReport> => {
    const analysisPrompt = `
        Rol: Eres un experto Estratega Digital, Analista de UX y Diseñador de UI especializado en Instagram.
        Tarea: Analiza el siguiente perfil conceptual de Instagram: ${profileUrl}. 
        Basándote en el nombre y el nicho potencial, realiza un análisis completo. No intentes acceder a la URL real. En su lugar, infiere el propósito del perfil y crea un análisis plausible.
        
        El análisis debe incluir:
        1.  **Un Resumen del Perfil**: Identifica 3-4 temas clave (ej: "Branding y Tono de Voz", "Calidad del Contenido", "Interacción con la Comunidad", "Estrategia de Hashtags"). Para cada tema, proporciona una evaluación ('good', 'review', 'change') y un resumen conciso de tu hallazgo.
        2.  **Una Auditoría Detallada**: Expande los hallazgos en un análisis más profundo para cada una de las siguientes áreas:
            a. **keyElements**: Una valoración de los elementos clave del perfil: "username", "profileName", "profilePicture", "biography", y "bioLink". Proporciona un breve análisis para cada uno.
            b. **postAnalysis**: Un análisis de publicaciones imaginarias. Describe 3 "bestPosts" y 3 "worstPosts". Para cada post, proporciona una "description" (descripción de la publicación imaginaria) y una "reason" (por qué es buena o mala).
            c. **highlightsAnalysis**: Un análisis de la estrategia y uso de las historias destacadas.
            d. **contentStrategy**: Un análisis general de la estrategia de contenido (temas, formatos, frecuencia).
            e. **visualAesthetics**: Un análisis de la estética visual (feed, colores, tipografía, calidad de imagen).
            f. **engagementAnalysis**: Un análisis del engagement y la comunidad (interacción en comentarios, uso de stories interactivas).

        Formato de Salida: Un único objeto JSON con las claves "profileSummary" y "audit".
        - "profileSummary" debe ser un array de objetos, cada uno con "topic" (string), "evaluation" ('good', 'review', o 'change'), y "summary" (string).
        - "audit" debe ser un objeto con las subclaves: "keyElements", "postAnalysis", "highlightsAnalysis", "contentStrategy", "visualAesthetics", y "engagementAnalysis".
        TODO el texto debe estar en español.
    `;

    const analysisResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: analysisPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    profileSummary: {
                        type: Type.ARRAY,
                        description: "Resumen de los puntos clave del perfil con su evaluación.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                topic: { type: Type.STRING, description: "El tema evaluado." },
                                evaluation: { type: Type.STRING, enum: ['good', 'review', 'change'], description: "La evaluación del tema." },
                                summary: { type: Type.STRING, description: "Un resumen corto de la evaluación." }
                            },
                            required: ["topic", "evaluation", "summary"]
                        }
                    },
                    audit: {
                        type: Type.OBJECT,
                        properties: {
                            keyElements: {
                                type: Type.OBJECT,
                                description: "Evaluación de los elementos clave del perfil.",
                                properties: {
                                    username: { type: Type.STRING, description: "Análisis del nombre de usuario." },
                                    profileName: { type: Type.STRING, description: "Análisis del nombre de perfil." },
                                    profilePicture: { type: Type.STRING, description: "Análisis de la foto de perfil." },
                                    biography: { type: Type.STRING, description: "Análisis de la biografía." },
                                    bioLink: { type: Type.STRING, description: "Análisis del enlace en la biografía." },
                                },
                                required: ["username", "profileName", "profilePicture", "biography", "bioLink"]
                            },
                            postAnalysis: {
                                type: Type.OBJECT,
                                description: "Análisis de publicaciones buenas y malas.",
                                properties: {
                                    bestPosts: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                description: { type: Type.STRING },
                                                reason: { type: Type.STRING }
                                            },
                                            required: ["description", "reason"]
                                        }
                                    },
                                    worstPosts: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                description: { type: Type.STRING },
                                                reason: { type: Type.STRING }
                                            },
                                            required: ["description", "reason"]
                                        }
                                    }
                                },
                                required: ["bestPosts", "worstPosts"]
                            },
                            highlightsAnalysis: { type: Type.STRING, description: "Análisis de las historias destacadas." },
                            contentStrategy: { type: Type.STRING, description: "Análisis de la estrategia de contenido." },
                            visualAesthetics: { type: Type.STRING, description: "Análisis de la estética visual." },
                            engagementAnalysis: { type: Type.STRING, description: "Análisis del engagement y la comunidad." },
                        },
                        required: ["keyElements", "postAnalysis", "highlightsAnalysis", "contentStrategy", "visualAesthetics", "engagementAnalysis"]
                    }
                },
                required: ["profileSummary", "audit"]
            }
        }
    });

    const analysisResult = parseJsonResponse<{ audit: Audit; profileSummary: ProfileSummaryItem[] }>(analysisResponse.text);
    if (!analysisResult) {
        throw new Error("El análisis inicial no pudo ser generado o parseado correctamente.");
    }
    
    const recommendationsPrompt = `
        Contexto: Se ha realizado la siguiente auditoría y resumen de un perfil de Instagram: 
        - Resumen de Evaluación: ${JSON.stringify(analysisResult.profileSummary)}
        - Auditoría Detallada: ${JSON.stringify(analysisResult.audit)}
        Rol: Actúa como el mismo experto Estratega Digital, Analista de UX y Diseñador de UI.
        Tarea: Genera un conjunto de recomendaciones accionables y un plan paso a paso para mejorar el perfil basándote en la auditoría y el resumen de evaluación. Asegúrate de que las recomendaciones aborden directamente los puntos marcados para 'review' y 'change', así como los hallazgos en la valoración de elementos clave, el análisis de publicaciones y los destacados.
        Formato de Salida: Un único objeto JSON con la clave "recommendations". Esta clave debe contener un objeto con las subclaves: "quickWins" (array de strings), "strategicChanges" (array de strings), y "actionPlan" (array de objetos con claves "step" (número) y "action" (string)). TODO el texto debe estar en español.
    `;

    const recommendationsResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: recommendationsPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    recommendations: {
                        type: Type.OBJECT,
                        properties: {
                            quickWins: { type: Type.ARRAY, items: { type: Type.STRING } },
                            strategicChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
                            actionPlan: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        step: { type: Type.INTEGER },
                                        action: { type: Type.STRING }
                                    },
                                    required: ["step", "action"]
                                }
                            }
                        },
                        required: ["quickWins", "strategicChanges", "actionPlan"]
                    }
                },
                required: ["recommendations"]
            }
        }
    });

    const recommendationsResult = parseJsonResponse<{ recommendations: Recommendations }>(recommendationsResponse.text);
    if (!recommendationsResult) {
        throw new Error("Las recomendaciones no pudieron ser generadas o parseadas correctamente.");
    }
    
    return {
        profileSummary: analysisResult.profileSummary,
        audit: analysisResult.audit,
        recommendations: recommendationsResult.recommendations,
    };
};
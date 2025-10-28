export interface KeyElementEvaluation {
    username: string;
    profileName: string;
    profilePicture: string;
    biography: string;
    bioLink: string;
}

export interface PostExample {
    description: string;
    reason: string;
}

export interface PostAnalysis {
    bestPosts: PostExample[];
    worstPosts: PostExample[];
}

export interface Audit {
    keyElements: KeyElementEvaluation;
    postAnalysis: PostAnalysis;
    highlightsAnalysis: string;
    contentStrategy: string;
    visualAesthetics: string;
    engagementAnalysis: string;
}

export interface ActionPlanItem {
    step: number;
    action: string;
}

export interface Recommendations {
    quickWins: string[];
    strategicChanges: string[];
    actionPlan: ActionPlanItem[];
}

export type Evaluation = 'good' | 'review' | 'change';

export interface ProfileSummaryItem {
    topic: string;
    evaluation: Evaluation;
    summary: string;
}

export interface InstagramReport {
    profileSummary: ProfileSummaryItem[];
    audit: Audit;
    recommendations: Recommendations;
}
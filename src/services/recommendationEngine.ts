import { assessmentService } from "./assessmentService";
import { moodService } from "./moodService";
import type { AssessmentResult, MoodEntry } from "../types";

export interface GeneratedRecommendation {
    id: string;
    category:
    | "breathing"
    | "meditation"
    | "yoga"
    | "self-care"
    | "professional-support";
    title: string;
    description: string;
    reason: string;
    source: "assessment" | "mood" | "combined";
    createdAt: string;
}

export const recommendationEngine = {
    generate(userId: string): GeneratedRecommendation[] {
        const recommendations: GeneratedRecommendation[] = [];
        const now = new Date().toISOString();

        const latestAssessment: AssessmentResult | null =
            assessmentService.getLatestAssessment(userId);

        const latestMood: MoodEntry | null =
            moodService.getLatestMood(userId);

        const add = (
            id: string,
            category: GeneratedRecommendation["category"],
            title: string,
            description: string,
            reason: string,
            source: GeneratedRecommendation["source"]
        ) => {
            recommendations.push({
                id,
                category,
                title,
                description,
                reason,
                source,
                createdAt: now,
            });
        };

        const severity = latestAssessment?.severity?.toLowerCase() ?? "";
        const mood = latestMood?.mood ?? null;

        // Professional support for high-severity assessment results.
        if (
            ["severe", "moderately_severe"].includes(severity)
        ) {
            add(
                "professional-support",
                "professional-support",
                "Consider Professional Support",
                "Consider speaking with a qualified mental health professional for personalized support.",
                "Your assessment indicates that additional support may be helpful.",
                "assessment"
            );
        }

        // Mood-based recommendations.
        if (mood !== null && mood <= 2) {
            add(
                "breathing",
                "breathing",
                "Try a Breathing Exercise",
                "Take a few minutes to breathe slowly and comfortably in a quiet place.",
                "Your recent mood suggests that a calming activity may help.",
                "mood"
            );

            add(
                "self-care",
                "self-care",
                "Take a Small Self-Care Break",
                "Choose one manageable activity, such as a short walk, resting, or talking to someone you trust.",
                "Small, achievable activities can support your daily wellbeing.",
                "mood"
            );
        }

        if (mood !== null && mood >= 4) {
            add(
                "gratitude",
                "self-care",
                "Practice Gratitude",
                "Write down one thing you appreciated about today.",
                "Reflecting on positive moments can help you maintain a helpful routine.",
                "mood"
            );
        }

        // Assessment-based recommendations.
        if (latestAssessment && severity !== "") {
            add(
                "meditation",
                "meditation",
                "Try a Short Meditation",
                "Set aside five minutes for a guided meditation or quiet reflection.",
                "A brief mindfulness activity may complement your wellbeing routine.",
                "assessment"
            );
        }

        // Safe fallback when there is little or no user data.
        if (recommendations.length === 0) {
            add(
                "daily-wellbeing",
                "self-care",
                "Build a Small Wellbeing Routine",
                "Start with a short walk, regular breaks, or a few minutes of quiet time.",
                "This is a general wellbeing suggestion, not a clinical assessment.",
                "combined"
            );
        }

        return recommendations.slice(0, 4);
    },
};
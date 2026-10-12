
import { assessmentService } from "./assessmentService";
import { moodService } from "./moodService";

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
        if (!userId.trim()) {
            throw new Error("User ID is required.");
        }

        const results: GeneratedRecommendation[] = [];
        const now = new Date().toISOString();

        const assessments = assessmentService.getAssessments(userId);
        const latestAssessment = assessmentService.getLatestAssessment(userId);
        const moods = moodService.getMoodEntries(userId);
        const latestMood = moodService.getLatestMood(userId);

        const recentMoods = moods.filter(
            (entry) =>
                Date.now() - new Date(entry.createdAt).getTime() <=
                7 * 24 * 60 * 60 * 1000
        );

        const averageMood =
            recentMoods.length > 0
                ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) /
                recentMoods.length
                : null;

        const add = (
            id: string,
            category: GeneratedRecommendation["category"],
            title: string,
            description: string,
            reason: string,
            source: GeneratedRecommendation["source"]
        ) => {
            results.push({
                id,
                category,
                title,
                description,
                reason,
                source,
                createdAt: now,
            });
        };

        const severity = latestAssessment?.severity.toLowerCase() ?? "";
        const lowMood =
            (latestMood !== null && latestMood.mood <= 2) ||
            (averageMood !== null && averageMood < 2.5);

        if (
            latestAssessment &&
            ["severe", "moderately severe", "moderately_severe"].includes(severity)
        ) {
            add(
                "professional-support",
                "professional-support",
                "Consider Professional Support",
                "Consider speaking with a qualified mental health professional.",
                "Your latest assessment indicates that additional support may be helpful.",
                "assessment"
            );
        }

        if (lowMood) {
            add(
                "breathing",
                "breathing",
                "Try a Breathing Exercise",
                "Take a few minutes to breathe slowly and comfortably.",
                "Your recent mood entries suggest a calming activity may be helpful.",
                latestAssessment ? "combined" : "mood"
            );

            add(
                "self-care",
                "self-care",
                "Take a Self-Care Break",
                "Try a short walk, a regular break, or talking to someone you trust.",
                "Small, manageable activities can support everyday wellbeing.",
                "mood"
            );
        }

        if (latestAssessment && severity && severity !== "minimal") {
            add(
                "meditation",
                "meditation",
                "Try a Short Meditation",
                "Set aside five minutes for quiet reflection or guided meditation.",
                "Mindfulness may complement your wellbeing routine.",
                "assessment"
            );
        }

        if (latestMood && latestMood.mood >= 4) {
            add(
                "gratitude",
                "self-care",
                "Practice Gratitude",
                "Write down one thing you appreciated about today.",
                "Reflecting on positive moments can support a healthy routine.",
                "mood"
            );
        }

        if (results.length === 0) {
            add(
                "daily-wellbeing",
                "self-care",
                "Build a Small Wellbeing Routine",
                "Start with a short walk, regular breaks, or a few minutes of quiet time.",
                assessments.length === 0 && moods.length === 0
                    ? "Log your mood or complete an assessment for more personalized suggestions."
                    : "This is a general wellbeing suggestion, not a clinical assessment.",
                "combined"
            );
        }

        return results.slice(0, 4);
    },
};

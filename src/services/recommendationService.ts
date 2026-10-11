
import { storageService } from "./storageService";
import type { Recommendation } from "../types";

const RECOMMENDATIONS_KEY = "recommendations";

/**
 * Get all stored recommendations.
 */
function getAllRecommendations(): Recommendation[] {
    return (
        storageService.get<Recommendation[]>(
            RECOMMENDATIONS_KEY
        ) ?? []
    );
}

/**
 * Save recommendations for a specific user.
 * Existing recommendations for that user are replaced.
 */
function saveRecommendations(
    userId: string,
    recommendations: Recommendation[]
): Recommendation[] {
    if (!userId.trim()) {
        throw new Error("User ID is required.");
    }

    if (!Array.isArray(recommendations)) {
        throw new Error("Recommendations must be an array.");
    }

    const invalidRecommendation = recommendations.some(
        (recommendation) =>
            !recommendation ||
            recommendation.userId !== userId ||
            !recommendation.id?.trim() ||
            !recommendation.title?.trim() ||
            !recommendation.description?.trim()
    );

    if (invalidRecommendation) {
        throw new Error(
            "Each recommendation must have a valid ID, title, description, and matching user ID."
        );
    }

    const existing = getAllRecommendations().filter(
        (recommendation) => recommendation.userId !== userId
    );

    const updated = [...existing, ...recommendations];

    storageService.set(RECOMMENDATIONS_KEY, updated);

    return recommendations;
}

/**
 * Get recommendations belonging to one user.
 */
function getRecommendations(
    userId: string
): Recommendation[] {
    if (!userId.trim()) {
        return [];
    }

    return getAllRecommendations().filter(
        (recommendation) => recommendation.userId === userId
    );
}

/**
 * Get the most recently created recommendations first.
 */
function getLatestRecommendations(
    userId: string,
    limit = 3
): Recommendation[] {
    if (!userId.trim()) {
        return [];
    }

    if (!Number.isInteger(limit) || limit < 1) {
        throw new Error("Limit must be a positive integer.");
    }

    return getRecommendations(userId)
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, limit);
}

/**
 * Clear recommendations for one user only.
 */
function clearRecommendations(userId: string): void {
    if (!userId.trim()) {
        return;
    }

    const remaining = getAllRecommendations().filter(
        (recommendation) => recommendation.userId !== userId
    );

    storageService.set(RECOMMENDATIONS_KEY, remaining);
}

export const recommendationService = {
    saveRecommendations,
    getRecommendations,
    getLatestRecommendations,
    clearRecommendations,
};

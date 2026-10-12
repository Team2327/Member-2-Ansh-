
import { storageService } from "./storageService";
import type { Recommendation } from "../types";
import { recommendationEngine } from "./recommendationEngine";

const RECOMMENDATIONS_KEY = "recommendations";

function getAllRecommendations(): Recommendation[] {
  const storedData: unknown =
    storageService.get<unknown>(RECOMMENDATIONS_KEY);

  if (!Array.isArray(storedData)) {
    return [];
  }

  return storedData.filter(
    (item): item is Recommendation =>
      item !== null &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.userId === "string" &&
      typeof item.title === "string" &&
      typeof item.description === "string" &&
      typeof item.reason === "string" &&
      typeof item.createdAt === "string" &&
      typeof item.category === "string" &&
      typeof item.source === "string"
  );
}

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

  const invalid = recommendations.some(
    (item) =>
      !item ||
      item.userId !== userId ||
      !item.id?.trim() ||
      !item.title?.trim() ||
      !item.description?.trim()
  );

  if (invalid) {
    throw new Error("Invalid recommendations or mismatched user ID.");
  }

  const otherUsers = getAllRecommendations().filter(
    (item) => item.userId !== userId
  );

  storageService.set(RECOMMENDATIONS_KEY, [
    ...otherUsers,
    ...recommendations,
  ]);

  return recommendations;
}

function getRecommendations(userId: string): Recommendation[] {
  if (!userId.trim()) {
    return [];
  }

  return getAllRecommendations().filter(
    (item) => item.userId === userId
  );
}

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

function clearRecommendations(userId: string): void {
  if (!userId.trim()) {
    return;
  }

  const remaining = getAllRecommendations().filter(
    (item) => item.userId !== userId
  );

  storageService.set(RECOMMENDATIONS_KEY, remaining);
}

function refreshRecommendations(userId: string): Recommendation[] {
  if (!userId.trim()) {
    throw new Error("User ID is required.");
  }

  const generated = recommendationEngine.generate(userId);

  const recommendations: Recommendation[] = generated.map((item) => ({
    ...item,
    userId,
  }));

  return saveRecommendations(userId, recommendations);
}

export const recommendationService = {
  saveRecommendations,
  getRecommendations,
  getLatestRecommendations,
  clearRecommendations,
  refreshRecommendations,
};

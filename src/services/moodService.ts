// src/services/moodService.ts

import { storageService } from "./storageService";
import type { MoodEntry } from "../types";
import { recommendationService } from "./recommendationService";
const MOODS_KEY = "moods";

/**
 * Get all mood entries from storage.
 */
function getAllMoodEntries(): MoodEntry[] {
    return storageService.get<MoodEntry[]>(MOODS_KEY) ?? [];
}

/**
 * Add a new mood entry for a user.
 */
function addMoodEntry(
    userId: string,
    mood: number,
    note?: string
): MoodEntry {
    if (!userId.trim()) {
        throw new Error("User ID is required.");
    }

    if (!Number.isFinite(mood) || mood < 1 || mood > 5) {
        throw new Error("Mood must be a number between 1 and 5.");
    }

    const moodEntry: MoodEntry = {
        id: crypto.randomUUID(),
        userId,
        mood,
        note: note?.trim() || undefined,
        createdAt: new Date().toISOString(),
    };

    const existingEntries = getAllMoodEntries();


    storageService.set(MOODS_KEY, [
        ...existingEntries,
        moodEntry,
    ]);



    recommendationService.refreshRecommendations(userId);

    return moodEntry;

    return moodEntry;
}

/**
 * Get mood entries belonging to a specific user.
 */
function getMoodEntries(userId: string): MoodEntry[] {
    if (!userId.trim()) {
        return [];
    }

    return getAllMoodEntries().filter(
        (entry) => entry.userId === userId
    );
}

/**
 * Get the most recent mood entry for a user.
 */
function getLatestMood(
    userId: string
): MoodEntry | null {
    const entries = getMoodEntries(userId);

    if (entries.length === 0) {
        return null;
    }

    return entries.reduce((latest, current) => {
        return new Date(current.createdAt).getTime() >
            new Date(latest.createdAt).getTime()
            ? current
            : latest;
    });
}

/**
 * Delete a specific mood entry.
 */
function deleteMoodEntry(
    userId: string,
    moodId: string
): void {
    const entries = getAllMoodEntries();

    const updatedEntries = entries.filter(
        (entry) =>
            !(
                entry.id === moodId &&
                entry.userId === userId
            )
    );

    storageService.set(MOODS_KEY, updatedEntries);
}

/**
 * Public mood service.
 */
export const moodService = {
    addMoodEntry,
    getMoodEntries,
    getLatestMood,
    deleteMoodEntry,
};
// src/services/assessmentService.ts

import { storageService } from "./storageService";
import type { AssessmentResult } from "../types";

const ASSESSMENTS_KEY = "assessments";

/**
 * Internal storage record.
 *
 * AssessmentResult ka original contract untouched rahega.
 * userId sirf persistence layer ke liye use hota hai.
 */
interface StoredAssessment {
    userId: string;
    result: AssessmentResult;
}

/**
 * Get all assessment records from storage.
 */
function getAllAssessments(): StoredAssessment[] {
    return (
        storageService.get<StoredAssessment[]>(
            ASSESSMENTS_KEY
        ) ?? []
    );
}

/**
 * Save an assessment result for a specific user.
 */
function saveAssessment(
    userId: string,
    result: AssessmentResult
): AssessmentResult {
    if (!userId.trim()) {
        throw new Error("User ID is required.");
    }

    const assessments = getAllAssessments();

    const storedAssessment: StoredAssessment = {
        userId,
        result,
    };

    storageService.set(ASSESSMENTS_KEY, [
        ...assessments,
        storedAssessment,
    ]);

    return result;
}

/**
 * Get all assessments belonging to a specific user.
 */
function getAssessments(
    userId: string
): AssessmentResult[] {
    if (!userId.trim()) {
        return [];
    }

    return getAllAssessments()
        .filter(
            (assessment) =>
                assessment.userId === userId
        )
        .map(
            (assessment) => assessment.result
        );
}

/**
 * Get the latest assessment for a user.
 */
function getLatestAssessment(
    userId: string
): AssessmentResult | null {
    const assessments = getAssessments(userId);

    if (assessments.length === 0) {
        return null;
    }

    return assessments.reduce(
        (latest, current) => {
            return new Date(
                current.completedAt
            ).getTime() >
                new Date(
                    latest.completedAt
                ).getTime()
                ? current
                : latest;
        }
    );
}

/**
 * Clear all assessments belonging to a specific user.
 */
function clearAssessments(
    userId: string
): void {
    if (!userId.trim()) {
        return;
    }

    const assessments = getAllAssessments();

    const remainingAssessments =
        assessments.filter(
            (assessment) =>
                assessment.userId !== userId
        );

    storageService.set(
        ASSESSMENTS_KEY,
        remainingAssessments
    );
}

/**
 * Public assessment service.
 */
export const assessmentService = {
    saveAssessment,
    getAssessments,
    getLatestAssessment,
    clearAssessments,
};
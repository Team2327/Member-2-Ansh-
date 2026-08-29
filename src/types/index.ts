// src/types/index.ts

/**
 * Represents a registered EMORA user.
 */
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
}

/**
 * Represents the user's active login session.
 */
export interface Session {
    userId: string;
    email: string;
    createdAt: string;
}

/**
 * Represents one mood entry recorded by a user.
 *
 * The numeric mood value can later be used directly
 * by Member 3 for Recharts.
 */
export interface MoodEntry {
    id: string;
    userId: string;
    mood: number;
    note?: string;
    createdAt: string;
}

/**
 * Represents an appointment with a demo doctor or therapist.
 */
export interface Appointment {
    id: string;
    userId: string;
    professionalId: string;
    professionalName: string;
    professionalType: "Doctor" | "Therapist";
    date: string;
    time: string;
    status: "booked" | "cancelled";
    createdAt: string;
}

/**
 * Represents the user's Free/Premium subscription state.
 */
export interface SubscriptionState {
    userId: string;
    plan: "Free" | "Premium";
    upgradedAt?: string;
}

/**
 * Assessment result shared between Member 1 and Member 2.
 *
 * IMPORTANT:
 * This structure is kept according to the shared
 * assessment contract in the Member-2 prompt.
 */
export interface AssessmentResult {
    type: string;
    score: number;
    maxScore: number;
    severity: string;
    answers: number[];
    completedAt: string;
}
// src/services/subscriptionService.ts

import { storageService } from "./storageService";
import type { SubscriptionState } from "../types";

const SUBSCRIPTION_KEY = "subscription";

/**
 * Get all stored subscription states.
 */
function getAllSubscriptions(): SubscriptionState[] {
    return (
        storageService.get<SubscriptionState[]>(
            SUBSCRIPTION_KEY
        ) ?? []
    );
}

/**
 * Get a user's subscription.
 *
 * New users are Free by default.
 */
function getSubscription(
    userId: string
): SubscriptionState {
    if (!userId.trim()) {
        throw new Error("User ID is required.");
    }

    const subscriptions = getAllSubscriptions();

    const existing = subscriptions.find(
        (subscription) =>
            subscription.userId === userId
    );

    if (existing) {
        return existing;
    }

    const freeSubscription: SubscriptionState = {
        userId,
        plan: "Free",
    };

    storageService.set(SUBSCRIPTION_KEY, [
        ...subscriptions,
        freeSubscription,
    ]);

    return freeSubscription;
}

/**
 * Check whether a user has Premium access.
 */
function isPremium(userId: string): boolean {
    return getSubscription(userId).plan === "Premium";
}

/**
 * Simulate upgrading a user to Premium.
 *
 * No real payment or payment information is handled.
 */
function upgradeToPremium(
    userId: string
): SubscriptionState {
    if (!userId.trim()) {
        throw new Error("User ID is required.");
    }

    const subscriptions = getAllSubscriptions();

    const existing = subscriptions.find(
        (subscription) =>
            subscription.userId === userId
    );

    if (existing?.plan === "Premium") {
        return existing;
    }

    const upgradedSubscription: SubscriptionState = {
        userId,
        plan: "Premium",
        upgradedAt: new Date().toISOString(),
    };

    const updatedSubscriptions = existing
        ? subscriptions.map((subscription) =>
            subscription.userId === userId
                ? upgradedSubscription
                : subscription
        )
        : [
            ...subscriptions,
            upgradedSubscription,
        ];

    storageService.set(
        SUBSCRIPTION_KEY,
        updatedSubscriptions
    );

    return upgradedSubscription;
}

/**
 * Check whether a feature is available
 * for the user's current subscription.
 */
function canAccessFeature(
    userId: string,
    requiresPremium: boolean
): boolean {
    if (!requiresPremium) {
        return true;
    }

    return isPremium(userId);
}

/**
 * Public subscription service.
 */
export const subscriptionService = {
    getSubscription,
    isPremium,
    upgradeToPremium,
    canAccessFeature,
};
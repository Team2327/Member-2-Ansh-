// src/services/storageService.ts

/**
 * Centralized storage service for EMORA.
 *
 * The application should use this service whenever it needs
 * to save or retrieve data from localStorage.
 *
 * This keeps storage-related logic in one place and makes
 * future migration to a backend easier.
 */

const STORAGE_PREFIX = "emora:";

/**
 * Adds the EMORA namespace to a storage key.
 *
 * Example:
 * "users" -> "emora:users"
 */
function createKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
}

/**
 * Get data from localStorage.
 *
 * The generic type <T> tells TypeScript what type of data
 * we expect to receive.
 *
 * Returns null if the key does not exist or the stored
 * data cannot be parsed.
 */
function get<T>(key: string): T | null {
    const storageKey = createKey(key);

    try {
        const storedValue = localStorage.getItem(storageKey);

        if (storedValue === null) {
            return null;
        }

        return JSON.parse(storedValue) as T;
    } catch (error) {
        console.error(
            `Failed to read storage key: ${storageKey}`,
            error
        );

        return null;
    }
}

/**
 * Save data to localStorage.
 *
 * JSON.stringify converts the JavaScript value into a
 * string because localStorage stores strings only.
 */
function set<T>(key: string, value: T): void {
    const storageKey = createKey(key);

    try {
        localStorage.setItem(
            storageKey,
            JSON.stringify(value)
        );
    } catch (error) {
        console.error(
            `Failed to save storage key: ${storageKey}`,
            error
        );

        throw new Error("Unable to save data.");
    }
}

/**
 * Remove one item from EMORA storage.
 */
function remove(key: string): void {
    const storageKey = createKey(key);

    try {
        localStorage.removeItem(storageKey);
    } catch (error) {
        console.error(
            `Failed to remove storage key: ${storageKey}`,
            error
        );

        throw new Error("Unable to remove data.");
    }
}

/**
 * Check whether a particular EMORA storage key exists.
 */
function has(key: string): boolean {
    const storageKey = createKey(key);

    try {
        return localStorage.getItem(storageKey) !== null;
    } catch (error) {
        console.error(
            `Failed to check storage key: ${storageKey}`,
            error
        );

        throw new Error("Unable to check stored data.");
    }
}

/**
 * Clear all EMORA-specific data.
 *
 * We do NOT use localStorage.clear() because that could
 * remove data belonging to other applications.
 */
function clear(): void {
    try {
        const keysToRemove: string[] = [];

        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index);

            if (key !== null && key.startsWith(STORAGE_PREFIX)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach((key) => {
            localStorage.removeItem(key);
        });
    } catch (error) {
        console.error("Failed to clear EMORA storage.", error);

        throw new Error("Unable to clear data.");
    }
}

/**
 * Public storage service.
 *
 * Other services should import this object instead of
 * accessing localStorage directly.
 */
export const storageService = {
    get,
    set,
    remove,
    has,
    clear,
};
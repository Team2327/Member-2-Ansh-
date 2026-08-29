// src/services/chatService.ts

import { storageService } from "./storageService";
import type { ChatMessage } from "../types";

const CHAT_HISTORY_KEY = "chat-history";

/**
 * Get all chat messages stored in localStorage.
 */
function getAllMessages(): ChatMessage[] {
    return (
        storageService.get<ChatMessage[]>(
            CHAT_HISTORY_KEY
        ) ?? []
    );
}

/**
 * Save a new chat message.
 */
function saveMessage(
    userId: string,
    role: "user" | "assistant",
    content: string
): ChatMessage {
    if (!userId.trim()) {
        throw new Error("User ID is required.");
    }

    if (!content.trim()) {
        throw new Error("Message content is required.");
    }

    const message: ChatMessage = {
        id: crypto.randomUUID(),
        userId,
        role,
        content: content.trim(),
        createdAt: new Date().toISOString(),
    };

    const messages = getAllMessages();

    storageService.set(CHAT_HISTORY_KEY, [
        ...messages,
        message,
    ]);

    return message;
}

/**
 * Get chat history belonging to a specific user.
 */
function getMessages(userId: string): ChatMessage[] {
    if (!userId.trim()) {
        return [];
    }

    return getAllMessages().filter(
        (message) => message.userId === userId
    );
}

/**
 * Clear chat history for a specific user.
 */
function clearMessages(userId: string): void {
    if (!userId.trim()) {
        return;
    }

    const messages = getAllMessages();

    const remainingMessages = messages.filter(
        (message) => message.userId !== userId
    );

    storageService.set(
        CHAT_HISTORY_KEY,
        remainingMessages
    );
}

/**
 * Public chat persistence service.
 */
export const chatService = {
    saveMessage,
    getMessages,
    clearMessages,
};
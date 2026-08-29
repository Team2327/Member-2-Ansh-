// src/services/authService.ts

import { storageService } from "./storageService";
import type { Session, User } from "../types";
import {
  validateLogin,
  validateSignup,
} from "../utils/validation";

const USERS_KEY = "users";
const SESSION_KEY = "session";

/**
 * Get all registered users from storage.
 */
function getUsers(): User[] {
  return storageService.get<User[]>(USERS_KEY) ?? [];
}

/**
 * Register a new user.
 */
function signup(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): User {
  // Validate signup fields first.
  const validationErrors = validateSignup(
    name,
    email,
    password,
    confirmPassword
  );

  if (Object.keys(validationErrors).length > 0) {
    const firstError =
      Object.values(validationErrors)[0];

    throw new Error(firstError);
  }

  const users = getUsers();

  // Normalize email before storing/checking it.
  const normalizedEmail = email.trim().toLowerCase();

  // Prevent duplicate accounts.
  const existingUser = users.find(
    (user) => user.email === normalizedEmail
  );

  if (existingUser) {
    throw new Error(
      "An account with this email already exists."
    );
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  storageService.set(USERS_KEY, [
    ...users,
    newUser,
  ]);

  return newUser;
}

/**
 * Log in an existing user.
 */
function login(
  email: string,
  password: string
): Session {
  // Validate login fields first.
  const validationErrors = validateLogin(
    email,
    password
  );

  if (Object.keys(validationErrors).length > 0) {
    const firstError =
      Object.values(validationErrors)[0];

    throw new Error(firstError);
  }

  const users = getUsers();

  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (currentUser) =>
      currentUser.email === normalizedEmail &&
      currentUser.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
    createdAt: new Date().toISOString(),
  };

  storageService.set(SESSION_KEY, session);

  return session;
}

/**
 * Log out the current user.
 */
function logout(): void {
  storageService.remove(SESSION_KEY);
}

/**
 * Restore the current session from storage.
 */
function getCurrentSession(): Session | null {
  return storageService.get<Session>(SESSION_KEY);
}

/**
 * Check whether a user is currently authenticated.
 */
function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

/**
 * Public authentication service.
 */
export const authService = {
  signup,
  login,
  logout,
  getCurrentSession,
  isAuthenticated,
};
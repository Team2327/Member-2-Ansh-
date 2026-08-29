// src/utils/validation.ts

/**
 * Checks whether a string contains a non-empty value.
 */
export function isRequired(value: string): boolean {
    return value.trim().length > 0;
}

/**
 * Validates an email address.
 */
export function isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email.trim());
}

/**
 * EMORA MVP password rule.
 *
 * Minimum length: 6 characters.
 */
export function isValidPassword(password: string): boolean {
    return password.length >= 6;
}

/**
 * Checks whether two passwords match.
 */
export function passwordsMatch(
    password: string,
    confirmPassword: string
): boolean {
    return password === confirmPassword;
}

/**
 * Validates signup form fields.
 *
 * Returns an object containing field-specific error messages.
 * An empty object means validation passed.
 */
export function validateSignup(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!isRequired(name)) {
        errors.name = "Name is required.";
    }

    if (!isRequired(email)) {
        errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (!isRequired(password)) {
        errors.password = "Password is required.";
    } else if (!isValidPassword(password)) {
        errors.password =
            "Password must be at least 6 characters.";
    }

    if (!isRequired(confirmPassword)) {
        errors.confirmPassword =
            "Please confirm your password.";
    } else if (!passwordsMatch(password, confirmPassword)) {
        errors.confirmPassword =
            "Passwords do not match.";
    }

    return errors;
}

/**
 * Validates login fields.
 */
export function validateLogin(
    email: string,
    password: string
): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!isRequired(email)) {
        errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (!isRequired(password)) {
        errors.password = "Password is required.";
    }

    return errors;
}

/**
 * Validates an appointment date and time.
 *
 * The selected date/time must be in the future.
 */
export function isValidAppointmentDateTime(
    date: string,
    time: string
): boolean {
    if (!isRequired(date) || !isRequired(time)) {
        return false;
    }

    const selectedDateTime = new Date(
        `${date}T${time}`
    );

    if (Number.isNaN(selectedDateTime.getTime())) {
        return false;
    }

    return selectedDateTime.getTime() > Date.now();
}
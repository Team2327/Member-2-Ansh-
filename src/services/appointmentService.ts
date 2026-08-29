// src/services/appointmentService.ts

import { storageService } from "./storageService";
import type { Appointment } from "../types";

const APPOINTMENTS_KEY = "appointments";

/**
 * Get all appointments stored in localStorage.
 */
function getAllAppointments(): Appointment[] {
    return (
        storageService.get<Appointment[]>(
            APPOINTMENTS_KEY
        ) ?? []
    );
}

/**
 * Create and save a new appointment.
 */
function createAppointment(
    userId: string,
    professionalId: string,
    professionalName: string,
    professionalType: "Doctor" | "Therapist",
    date: string,
    time: string
): Appointment {
    if (!userId.trim()) {
        throw new Error("User ID is required.");
    }

    if (!professionalId.trim()) {
        throw new Error("Professional ID is required.");
    }

    if (!professionalName.trim()) {
        throw new Error(
            "Professional name is required."
        );
    }

    if (!date.trim()) {
        throw new Error("Appointment date is required.");
    }

    if (!time.trim()) {
        throw new Error("Appointment time is required.");
    }

    const appointment: Appointment = {
        id: crypto.randomUUID(),
        userId,
        professionalId,
        professionalName,
        professionalType,
        date,
        time,
        status: "booked",
        createdAt: new Date().toISOString(),
    };

    const appointments = getAllAppointments();

    storageService.set(APPOINTMENTS_KEY, [
        ...appointments,
        appointment,
    ]);

    return appointment;
}

/**
 * Get all appointments belonging to a specific user.
 */
function getAppointments(
    userId: string
): Appointment[] {
    if (!userId.trim()) {
        return [];
    }

    return getAllAppointments().filter(
        (appointment) =>
            appointment.userId === userId
    );
}

/**
 * Cancel an appointment.
 *
 * The appointment is not deleted so that
 * appointment history remains available.
 */
function cancelAppointment(
    userId: string,
    appointmentId: string
): Appointment {
    if (!userId.trim()) {
        throw new Error("User ID is required.");
    }

    if (!appointmentId.trim()) {
        throw new Error(
            "Appointment ID is required."
        );
    }

    const appointments = getAllAppointments();

    const appointment = appointments.find(
        (item) =>
            item.id === appointmentId &&
            item.userId === userId
    );

    if (!appointment) {
        throw new Error(
            "Appointment not found."
        );
    }

    if (appointment.status === "cancelled") {
        throw new Error(
            "Appointment is already cancelled."
        );
    }

    const updatedAppointment: Appointment = {
        ...appointment,
        status: "cancelled",
    };

    const updatedAppointments =
        appointments.map((item) =>
            item.id === appointmentId &&
                item.userId === userId
                ? updatedAppointment
                : item
        );

    storageService.set(
        APPOINTMENTS_KEY,
        updatedAppointments
    );

    return updatedAppointment;
}

/**
 * Get a single appointment by ID for a user.
 */
function getAppointment(
    userId: string,
    appointmentId: string
): Appointment | null {
    if (
        !userId.trim() ||
        !appointmentId.trim()
    ) {
        return null;
    }

    return (
        getAllAppointments().find(
            (appointment) =>
                appointment.id === appointmentId &&
                appointment.userId === userId
        ) ?? null
    );
}

/**
 * Public appointment service.
 */
export const appointmentService = {
    createAppointment,
    getAppointments,
    getAppointment,
    cancelAppointment,
};
// src/data/professionals.ts

export interface Professional {
    id: string;
    name: string;
    type: "Doctor" | "Therapist";
    specialization: string;
    experience: number;
    languages: string[];
    availability: string[];
    fee: number;
}

export const professionals: Professional[] = [
    {
        id: "professional-1",
        name: "Dr. Meera Sharma",
        type: "Doctor",
        specialization: "Psychiatry",
        experience: 8,
        languages: ["English", "Hindi"],
        availability: [
            "10:00",
            "11:00",
            "15:00",
            "16:00",
        ],
        fee: 800,
    },
    {
        id: "professional-2",
        name: "Dr. Arjun Mehta",
        type: "Doctor",
        specialization: "Mental Health & Psychiatry",
        experience: 6,
        languages: ["English", "Hindi"],
        availability: [
            "09:00",
            "12:00",
            "14:00",
            "17:00",
        ],
        fee: 700,
    },
    {
        id: "professional-3",
        name: "Ananya Verma",
        type: "Therapist",
        specialization: "Cognitive Behavioural Therapy",
        experience: 5,
        languages: ["English", "Hindi"],
        availability: [
            "10:00",
            "13:00",
            "15:00",
            "18:00",
        ],
        fee: 600,
    },
    {
        id: "professional-4",
        name: "Rohan Kapoor",
        type: "Therapist",
        specialization: "Stress & Anxiety Management",
        experience: 7,
        languages: ["English"],
        availability: [
            "09:00",
            "11:00",
            "16:00",
            "19:00",
        ],
        fee: 650,
    },
];
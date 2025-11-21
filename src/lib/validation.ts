import { z } from 'zod';

// Phone number validation (Bangladesh format)
export const phoneSchema = z.string()
    .regex(/^(\+8801|01)[3-9]\d{8}$/, 'Invalid Bangladesh phone number');

// NID validation (10 or 13 or 17 digits)
export const nidSchema = z.string()
    .regex(/^\d{10}$|^\d{13}$|^\d{17}$/, 'NID must be 10, 13, or 17 digits');

// Blood group validation
export const bloodGroupSchema = z.enum([
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
]);

// Age validation (18-60 for donors)
export const donorAgeSchema = z.string().refine((dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 60;
}, 'Donor must be between 18 and 60 years old');

// Weight validation (minimum 50kg for donors)
export const donorWeightSchema = z.string().refine((weight) => {
    const w = parseFloat(weight);
    return w >= 50;
}, 'Donor must weigh at least 50 kg');

// Password strength validation
export const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

// Donor registration schema
export const donorRegistrationSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    bloodGroup: bloodGroupSchema,
    dateOfBirth: donorAgeSchema,
    gender: z.enum(['male', 'female', 'other']),
    phone: phoneSchema,
    email: z.string().email('Invalid email address'),
    nid: nidSchema,
    division: z.string().min(1, 'Division is required'),
    district: z.string().min(1, 'District is required'),
    upazila: z.string().min(1, 'Upazila is required'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    weight: donorWeightSchema,
    lastDonationDate: z.string().optional(),
});

// Sign up schema
export const signUpSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: phoneSchema,
    nid: nidSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

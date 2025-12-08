/**
 * Zod Validation Schemas
 * Comprehensive validation schemas for all forms in the application
 */
import { z } from 'zod';
import { 
  BLOOD_GROUPS, 
  DISTRICTS, 
  URGENCY_LEVELS,
  PHONE_REGEX,
  PHONE_REGEX_LOOSE,
  EMAIL_REGEX,
  NID_REGEX,
  MIN_DONOR_AGE,
  MAX_DONOR_AGE,
  MIN_DONOR_WEIGHT
} from './constants';

// Common validation schemas
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .regex(EMAIL_REGEX, 'Invalid email format');

export const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password is too long');

export const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(PHONE_REGEX_LOOSE, 'Invalid phone number format')
  .refine((val) => val.replace(/\D/g, '').length >= 10, {
    message: 'Phone number must contain at least 10 digits'
  });

export const nidSchema = z.string()
  .min(1, 'NID is required')
  .regex(NID_REGEX, 'NID must be 10-17 digits');

export const bloodGroupSchema = z.enum([...BLOOD_GROUPS] as [string, ...string[]], {
  errorMap: () => ({ message: 'Please select a valid blood group' })
});

export const districtSchema = z.enum([...DISTRICTS] as [string, ...string[]], {
  errorMap: () => ({ message: 'Please select a valid district' })
});

export const urgencySchema = z.enum([
  URGENCY_LEVELS.IMMEDIATE,
  URGENCY_LEVELS.URGENT,
  URGENCY_LEVELS.FLEXIBLE
] as [string, ...string[]], {
  errorMap: () => ({ message: 'Please select a valid urgency level' })
});

// Sign Up Form Schema
export const signUpSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: emailSchema,
  phone: phoneSchema,
  nid: nidSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

// Sign In Form Schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export type SignInFormData = z.infer<typeof signInSchema>;

// Complete Profile Schema
export const completeProfileSchema = z.object({
  blood_group: bloodGroupSchema,
  district: districtSchema,
  phone_number: phoneSchema,
  nid: nidSchema
});

export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

// Blood Request Schema
export const bloodRequestSchema = z.object({
  blood_group: bloodGroupSchema,
  location: z.string()
    .min(3, 'Location must be at least 3 characters')
    .max(200, 'Location is too long'),
  units_needed: z.number()
    .int('Units must be a whole number')
    .min(1, 'At least 1 unit is required')
    .max(50, 'Maximum 50 units per request'),
  urgency: urgencySchema,
  patient_info: z.string()
    .min(10, 'Patient information must be at least 10 characters')
    .max(1000, 'Patient information is too long'),
  contact_number: phoneSchema,
  patient_age: z.number()
    .int()
    .min(0)
    .max(150)
    .optional(),
  hospital_address: z.string()
    .max(500, 'Hospital address is too long')
    .optional(),
  blood_component: z.string()
    .max(50)
    .optional(),
  date_needed: z.string()
    .optional(),
  donor_requirements: z.string()
    .max(500)
    .optional(),
  additional_notes: z.string()
    .max(1000)
    .optional()
});

export type BloodRequestFormData = z.infer<typeof bloodRequestSchema>;

// Donor Registration Schema
export const donorRegistrationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: emailSchema,
  phone: phoneSchema,
  age: z.number()
    .int('Age must be a whole number')
    .min(MIN_DONOR_AGE, `Age must be at least ${MIN_DONOR_AGE} years`)
    .max(MAX_DONOR_AGE, `Age must be at most ${MAX_DONOR_AGE} years`),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a valid gender' })
  }),
  bloodGroup: bloodGroupSchema,
  weight: z.number()
    .min(MIN_DONOR_WEIGHT, `Weight must be at least ${MIN_DONOR_WEIGHT} kg`)
    .max(200, 'Weight seems unrealistic'),
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address is too long'),
  district: districtSchema,
  emergencyContact: z.string()
    .regex(PHONE_REGEX_LOOSE, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service'
  }),
  agreedToPrivacy: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Privacy Policy'
  })
});

export type DonorRegistrationFormData = z.infer<typeof donorRegistrationSchema>;

// User Profile Update Schema
export const userProfileUpdateSchema = z.object({
  full_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .optional(),
  phone: phoneSchema.optional(),
  blood_group: bloodGroupSchema.optional(),
  location: z.string()
    .max(200, 'Location is too long')
    .optional(),
  district: districtSchema.optional(),
  nid: nidSchema.optional()
});

export type UserProfileUpdateFormData = z.infer<typeof userProfileUpdateSchema>;

// Password Reset Schema
export const passwordResetSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

// Search/Filter Schemas
export const bloodRequestFiltersSchema = z.object({
  searchQuery: z.string().max(100).optional(),
  bloodGroup: bloodGroupSchema.optional(),
  urgency: urgencySchema.optional()
});

export type BloodRequestFilters = z.infer<typeof bloodRequestFiltersSchema>;

// Helper function to validate and parse form data
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

// Helper to format Zod errors for display
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    formatted[path] = err.message;
  });
  
  return formatted;
}


/**
 * Application Constants
 * Centralized constants for blood groups, districts, urgency levels, and other configuration values
 */

// Blood Groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = typeof BLOOD_GROUPS[number];

// Divisions of Bangladesh
export const DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh'
] as const;
export type Division = typeof DIVISIONS[number];

// Districts (Major districts in Bangladesh)
export const DISTRICTS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Comilla',
  'Gazipur',
  'Narayanganj',
  'Jessore',
  'Bogra',
  'Dinajpur',
  'Faridpur',
  'Brahmanbaria',
  'Noakhali',
  'Feni',
  'Cox\'s Bazar',
  'Lakshmipur',
  'Chandpur',
  'Kushtia',
  'Pabna',
  'Tangail',
  'Jamalpur',
  'Sherpur',
  'Netrokona',
  'Mymensingh',
  'Kishoreganj',
  'Manikganj',
  'Munshiganj',
  'Narsingdi',
  'Shariatpur',
  'Madaripur',
  'Gopalganj',
  'Rajbari',
  'Magura',
  'Jhenaidah',
  'Chuadanga',
  'Meherpur',
  'Jashore',
  'Satkhira',
  'Bagerhat',
  'Pirojpur',
  'Barguna',
  'Patuakhali',
  'Bhola',
  'Lakshmipur',
  'Noakhali',
  'Feni',
  'Chittagong',
  'Cox\'s Bazar',
  'Bandarban',
  'Rangamati',
  'Khagrachhari',
  'Sylhet',
  'Moulvibazar',
  'Habiganj',
  'Sunamganj',
  'Rajshahi',
  'Natore',
  'Naogaon',
  'Chapainawabganj',
  'Joypurhat',
  'Bogra',
  'Sirajganj',
  'Pabna',
  'Kushtia',
  'Meherpur',
  'Chuadanga',
  'Jhenaidah',
  'Magura',
  'Narail',
  'Khulna',
  'Bagerhat',
  'Satkhira',
  'Jessore',
  'Jashore',
  'Rangpur',
  'Dinajpur',
  'Gaibandha',
  'Kurigram',
  'Lalmonirhat',
  'Nilphamari',
  'Panchagarh',
  'Thakurgaon',
  'Mymensingh',
  'Jamalpur',
  'Netrokona',
  'Sherpur',
  'Kishoreganj',
  'Tangail'
] as const;
export type District = typeof DISTRICTS[number];

// Urgency Levels
export const URGENCY_LEVELS = {
  IMMEDIATE: 'immediate',
  URGENT: 'urgent',
  FLEXIBLE: 'flexible'
} as const;

export const URGENCY_OPTIONS = [
  { 
    value: URGENCY_LEVELS.IMMEDIATE, 
    label: 'Immediate', 
    color: 'bg-destructive text-destructive-foreground',
    description: 'Critical - needed within hours'
  },
  { 
    value: URGENCY_LEVELS.URGENT, 
    label: 'Urgent', 
    color: 'bg-primary text-primary-foreground',
    description: 'Needed within 24 hours'
  },
  { 
    value: URGENCY_LEVELS.FLEXIBLE, 
    label: 'Flexible', 
    color: 'bg-secondary text-secondary-foreground',
    description: 'Can wait a few days'
  }
] as const;

export type UrgencyLevel = typeof URGENCY_LEVELS[keyof typeof URGENCY_LEVELS];

// Pagination
export const ITEMS_PER_PAGE = 12;
export const MAX_PAGINATION_VISIBLE = 7;

// Phone Number Patterns
export const PHONE_REGEX = /^(\+880|0)?1[3-9]\d{8}$/;
export const PHONE_REGEX_LOOSE = /^[0-9+\-\s()]{7,}$/;

// Email Pattern
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// NID (National ID) Pattern (Bangladesh)
export const NID_REGEX = /^[0-9]{10,17}$/;

// Age Constraints
export const MIN_DONOR_AGE = 18;
export const MAX_DONOR_AGE = 60;

// Weight Constraints
export const MIN_DONOR_WEIGHT = 50; // kg

// Donation Eligibility
export const MIN_DAYS_BETWEEN_DONATIONS = 90; // 3 months
export const MIN_DAYS_BETWEEN_DONATIONS_6M = 180; // 6 months
export const MIN_DAYS_BETWEEN_DONATIONS_1Y = 365; // 1 year

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
] as const;
export type Gender = typeof GENDER_OPTIONS[number]['value'];

// Availability Options
export const AVAILABILITY_OPTIONS = [
  { value: 'now', label: 'Available now' },
  { value: '24hrs', label: 'Within 24 hours' },
  { value: 'flexible', label: 'Flexible' }
] as const;

// Last Donation Date Options
export const LAST_DONATION_OPTIONS = [
  { value: '3months', label: '3+ months ago' },
  { value: '6months', label: '6+ months ago' },
  { value: '1year', label: '1+ year ago' }
] as const;

// Distance Options
export const DISTANCE_OPTIONS = [
  { value: '5km', label: 'Within 5 km' },
  { value: '10km', label: 'Within 10 km' },
  { value: '25km', label: 'Within 25 km' },
  { value: '50km', label: 'Within 50 km' }
] as const;


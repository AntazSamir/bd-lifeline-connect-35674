# Fix: Donor Registration and Availability Update Issue

## Problem
After signing in and registering as a donor, users were unable to update their availability status. The system showed an error message: **"You need to register as a donor first"**.

## Root Cause
The issue had **two main problems**:

### 1. Missing `profile_id` Link
When a user registered as a donor through `DonorRegistrationForm`, the donor record was created in the `donors` table **without** the `profile_id` field. This field is crucial because:
- The `AvailabilityDialog` component searches for donor records using `profile_id` (line 51 in AvailabilityDialog.tsx)
- Without this link, the system couldn't find the donor record even though it existed

### 2. `is_donor` Flag Not Updated
The `user_profiles.is_donor` field was not being updated to `true` when someone registered as a donor. This flag should indicate whether a user is registered as a donor.

## Solution Applied

### Changes to `DonorRegistrationForm.tsx`

**File**: `src/components/DonorRegistrationForm.tsx`

Modified the `handleSubmit` function to:

1. **Get the authenticated user** before creating the donor record
   ```tsx
   const { supabase } = await import('@/services/supabaseClient');
   const { data: { user }, error: userError } = await supabase.auth.getUser();
   ```

2. **Add `profile_id` to the donor payload**
   ```tsx
   const payload = {
     // ... other fields
     profile_id: user.id, // Link to user profile
   };
   ```

3. **Update the `user_profiles` table** to mark the user as a donor
   ```tsx
   const { updateUserProfile } = await import('@/services/dbService');
   await updateUserProfile({ is_donor: true });
   ```

4. **Add the required `location` field** (using district value)
   ```tsx
   location: sanitize(formData.district), // Required field for Donor interface
   ```

## How It Works Now

### Registration Flow:
1. User signs up → Creates account in `auth.users`
2. User completes profile → Creates record in `user_profiles` with `is_donor: false`
3. User fills donor registration form → Creates record in `donors` table with:
   - `profile_id` = user's auth ID (links to user_profiles)
   - All donor-specific information
4. System updates `user_profiles.is_donor` to `true`

### Availability Update Flow:
1. User clicks "Update Availability"
2. `AvailabilityDialog` queries `donors` table using `profile_id`
3. Finds the donor record (because `profile_id` is now set)
4. Allows user to update availability status

## Database Schema

### `user_profiles` Table
- Stores basic user information
- `is_donor` (boolean) - Indicates if user is a registered donor
- `id` (UUID) - Primary key, references auth.users

### `donors` Table
- Stores detailed donor information
- `profile_id` (UUID) - Foreign key to user_profiles.id
- `is_available` (boolean) - Current availability status
- Other donor-specific fields

## Testing
To verify the fix works:
1. Sign in to the application
2. Navigate to "Become a Donor" 
3. Fill out and submit the donor registration form
4. Go to your profile
5. Click "Update Availability"
6. You should now be able to toggle your availability status ✅

## Files Modified
- `src/components/DonorRegistrationForm.tsx` - Added profile_id linking and is_donor flag update

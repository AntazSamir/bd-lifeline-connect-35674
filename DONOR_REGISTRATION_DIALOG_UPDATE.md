# Feature Update: Donor Registration Dialog Integration

## Summary
Updated the "Not Registered as Donor" dialog to open the **Donor Registration Dialog** directly instead of navigating to a separate page.

## Changes Made

### File: `src/components/AvailabilityDialog.tsx`

#### 1. **Removed Navigation**
- Removed `useNavigate` from React Router
- Removed navigation to `/become-donor` page

#### 2. **Added Dialog Integration**
- Imported `DonorRegistrationDialog` component
- Added state: `showRegistrationDialog` to control the registration dialog
- Updated `handleBecomeDonor()` to open the registration dialog instead of navigating

#### 3. **Added Registration Dialog Component**
```tsx
<DonorRegistrationDialog 
    open={showRegistrationDialog} 
    onOpenChange={(open) => {
        setShowRegistrationDialog(open);
        if (!open) {
            // Refresh donor status when dialog closes
            fetchDonorStatus();
        }
    }}
/>
```

#### 4. **Auto-Refresh After Registration**
When the registration dialog closes, it automatically calls `fetchDonorStatus()` to refresh the donor status, so if the user successfully registers, they won't see the "Not Registered" message again.

## User Flow

### Before:
1. User clicks "Update Availability"
2. Sees "Not Registered as Donor" dialog
3. Clicks "Become a Donor" button
4. **Navigates to a new page** `/become-donor`
5. Fills out registration form
6. Has to navigate back to profile

### After:
1. User clicks "Update Availability"
2. Sees "Not Registered as Donor" dialog
3. Clicks "Become a Donor" button
4. **Registration dialog opens immediately** (stays on same page)
5. Fills out registration form
6. Dialog closes automatically
7. Donor status refreshes
8. Can immediately update availability ✅

## Benefits
- ✅ **Better UX**: No page navigation required
- ✅ **Seamless Flow**: User stays in context
- ✅ **Auto-Refresh**: Donor status updates automatically after registration
- ✅ **Consistent UI**: Uses dialog pattern throughout

## Testing
1. Sign in as a non-donor user
2. Go to Profile page
3. Click "Update Availability"
4. Click "Become a Donor" button
5. Registration dialog should open
6. Complete registration
7. Dialog closes and donor status refreshes
8. Try "Update Availability" again - should now work!

# Fixing Password Reset 404 Error

## Problem
When users click the password reset link in the email, they encounter a 404 error:
```
404: NOT_FOUND Code: NOT_FOUND ID: sin1::hpxkl-1761588645942-ba85c5b1adbc
```

## Root Cause
The Supabase password reset email template is not correctly configured to point to your application's reset password route.

## Solution

### Step 1: Update Supabase Email Template

1. Log in to your Supabase Dashboard at https://app.supabase.com
2. Select your project (fjhtbrdnjhlxrwarcfrr)
3. Navigate to Authentication > Settings
4. Find the "Site URL" field and ensure it's set correctly:
   - For local development: `http://localhost:8080`
   - For production: your actual domain (e.g., https://yourdomain.com)

### Step 2: Configure Password Reset Email Template

1. In the Supabase Dashboard, scroll down to "Email Templates"
2. Click on "Reset Password" to edit the template
3. Update the reset password link in the email template to:

```html
<a href="{{ .SiteURL }}/reset-password?token_hash={{ .TokenHash }}&type=recovery&next={{ .RedirectTo }}">Reset Password</a>
```

### Step 3: Verify Application Route

Ensure your application has the correct route configured in [src/App.tsx](file:///C:/Users/rocks/OneDrive/Desktop/HTML/bd-lifeline-connect-35674/src/App.tsx):

```jsx
<Route path="/reset-password" element={<ResetPassword />} />
```

This route is already correctly configured in your application.

### Step 4: Test the Fix

1. Request a password reset from your application
2. Check your email for the reset link
3. Click the link and verify it redirects correctly to your reset password page

## Required Parameters

The URL must include these query parameters for the reset to work:
- `token_hash={{ .TokenHash }}`
- `type=recovery`
- `next={{ .RedirectTo }}`

## Additional Notes

- Make sure your Site URL in Supabase matches where your application is hosted
- For local development, use `http://localhost:8080`
- For production, use your actual domain
- The ResetPassword component in your application has been updated to properly handle the password reset flow

## Troubleshooting

If you still encounter issues:

1. Check browser console for any JavaScript errors
2. Verify network requests in developer tools
3. Ensure the Supabase credentials in your application are correct
4. Confirm the ResetPassword component is properly mounted

After making these changes, the password reset flow should work correctly.

## Component Improvements

The ResetPassword component has been enhanced to:
1. Properly extract and validate the token from URL parameters
2. Use the correct Supabase auth flow for password resets
3. Provide better error handling and user feedback
4. Disable the submit button until a valid token is present
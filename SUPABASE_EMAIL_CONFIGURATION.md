# Supabase Email Configuration for Email Confirmation

To ensure that email confirmation links redirect users back to your website, you need to configure the Supabase email templates.

## Configuration Steps

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Sign in with your credentials
   - Select your project (fjhtbrdnjhlxrwarcfrr)

2. **Navigate to Authentication Settings**
   - In the left sidebar, click on "Authentication"
   - Click on "Settings" tab

3. **Configure Site URL**
   - Find the "Site URL" field
   - Set it to your application's URL:
     - For local development: `http://localhost:8083`
     - For production: `https://yourdomain.com`

4. **Configure Email Templates**
   - Scroll down to "Email Templates"
   - Click on "Confirm Signup" to edit the template

5. **Update the Confirmation Link**
   - In the email template, find the confirmation link
   - Update it to redirect to your confirmation page:
   
   ```html
   <a href="{{ .SiteURL }}/confirm-email?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}">Confirm your email address</a>
   ```

6. **Save Changes**
   - Click "Save" to apply the changes

## Email Template Variables

Supabase provides the following variables for email templates:
- `{{ .SiteURL }}` - Your configured site URL
- `{{ .TokenHash }}` - The verification token hash
- `{{ .RedirectTo }}` - The redirect URL (if specified)

## Testing Email Confirmation

To test the email confirmation flow:

1. Register a new account in your application
2. Check your email for the confirmation message
3. Click the confirmation link
4. You should be redirected to your website's confirmation page
5. After successful confirmation, you'll be redirected to the sign-in page

## Troubleshooting

If email confirmation is not working:

1. **Check Site URL Configuration**
   - Ensure the Site URL is correctly set in Authentication Settings

2. **Verify Email Templates**
   - Make sure the confirmation link uses the correct format

3. **Check Application Routes**
   - Ensure `/confirm-email` route exists in your application

4. **Review Console Logs**
   - Check browser console for any JavaScript errors
   - Check network tab for failed requests

## Local Development vs Production

For local development, use:
```
http://localhost:8083
```

For production deployment, use your actual domain:
```
https://yourdomain.com
```

Remember to update the Site URL when deploying to different environments.
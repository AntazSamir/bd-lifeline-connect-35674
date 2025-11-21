# Password Reset Fix - Configuration Guide

## ✅ Code Fix Applied

The `ResetPassword.tsx` page has been updated to properly handle Supabase's password reset tokens.

**What was fixed:**
- Now reads the `access_token` from URL hash fragments (how Supabase sends it)
- Validates the session before allowing password reset
- Better error messages and user feedback
- Proper redirect after successful reset

---

## 🔧 Supabase Configuration Required

You need to configure your Supabase project to redirect to the correct URL.

### **Step 1: Go to Supabase Dashboard**

1. Open https://supabase.com/dashboard
2. Select your project: **fjhtbrdnjhlxrwarcfrr**
3. Go to **Authentication** → **URL Configuration**

### **Step 2: Add Redirect URLs**

In the **Redirect URLs** section, add these URLs:

**For Development:**
```
http://localhost:5173/**
```

**For Production (when you deploy):**
```
https://yourdomain.com/**
```

The `**` wildcard allows all paths under your domain.

### **Step 3: Set Site URL**

In the **Site URL** field, set:

**For Development:**
```
http://localhost:5173
```

**For Production:**
```
https://yourdomain.com
```

### **Step 4: Verify Email Template (Optional)**

Go to **Authentication** → **Email Templates** → **Reset Password**

The default template should work, but verify it looks like this:

```html
<h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>
<p><a href="{{ .SiteURL }}/reset-password">Reset Password</a></p>
```

The `{{ .SiteURL }}` will automatically use the Site URL you configured.

---

## 🧪 Testing the Fix

### **Test 1: Request Password Reset**

1. Go to Sign In page
2. Click "Forgot Password?"
3. Enter your email
4. Click "Send Reset Link"
5. Check your email

### **Test 2: Click Reset Link**

1. Open the email from Supabase
2. Click "Reset Password" link
3. **Expected:** You should see the Reset Password page (not homepage)
4. **Expected:** You should see a success toast: "Ready to reset"

### **Test 3: Reset Password**

1. Enter a new password (min 8 characters)
2. Confirm the password
3. Click "Reset Password"
4. **Expected:** Success message appears
5. **Expected:** Redirected to Sign In page after 2 seconds
6. **Expected:** Can sign in with new password

---

## 🐛 Troubleshooting

### **Issue: Still redirects to homepage**

**Solution:** Clear your browser cache and cookies, then try again.

### **Issue: "Invalid reset link" error**

**Possible causes:**
1. Link has expired (links expire after 1 hour by default)
2. Link was already used
3. Redirect URL not configured in Supabase

**Solution:** Request a new password reset link.

### **Issue: "Session expired" error**

**Cause:** The reset token has expired.

**Solution:** Request a new password reset link. Tokens are valid for 1 hour.

### **Issue: Email not received**

**Possible causes:**
1. Email in spam folder
2. Email doesn't exist in database
3. SMTP not configured in Supabase

**Solution:** 
- Check spam folder
- Verify email exists in Supabase Auth users
- Check Supabase logs for email delivery errors

---

## 📋 How It Works Now

1. **User requests reset:** Email sent with link containing recovery token
2. **User clicks link:** Supabase redirects to `/reset-password#access_token=xxx&type=recovery`
3. **Page loads:** Code extracts `access_token` from URL hash
4. **Validation:** Checks if session is valid
5. **User enters password:** Form validates password strength
6. **Submit:** Updates password using Supabase Auth
7. **Success:** Signs out user and redirects to sign in

---

## 🔐 Security Features

- ✅ Token validation before showing form
- ✅ Session verification
- ✅ Minimum 8 character password
- ✅ Password confirmation required
- ✅ Automatic sign out after reset
- ✅ Tokens expire after 1 hour
- ✅ Tokens can only be used once

---

## 📝 Next Steps

1. **Configure Supabase** (Steps 1-3 above) - **REQUIRED**
2. **Test the flow** (Test 1-3 above)
3. **Update production URLs** when you deploy

---

## ✅ Verification Checklist

- [ ] Supabase Redirect URLs configured
- [ ] Supabase Site URL configured
- [ ] Password reset email received
- [ ] Reset link opens Reset Password page (not homepage)
- [ ] Can successfully reset password
- [ ] Can sign in with new password

---

**Last Updated:** 2025-11-21 1:15 PM
**Status:** Code fixed ✅ | Supabase config required ⏳

# Profile Editing Features - Implementation Guide

**Created:** 2025-11-21 1:46 PM

---

## ✅ **Components Created**

I've created 3 new dialog components for profile management:

1. ✅ **`EditProfileDialog.tsx`** - Edit personal information
2. ✅ **`AvailabilityDialog.tsx`** - Update donor availability status
3. ✅ **`NotificationSettingsDialog.tsx`** - Manage notification preferences

---

## 🔧 **How to Integrate into Profile.tsx**

### **Step 1: Add Imports**

At the top of `src/pages/Profile.tsx`, add these imports after the existing imports:

```typescript
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { AvailabilityDialog } from "@/components/AvailabilityDialog";
import { NotificationSettingsDialog } from "@/components/NotificationSettingsDialog";
```

### **Step 2: Add State Variables**

After line 30 (after `const [loading, setLoading] = useState(true);`), add:

```typescript
const [editProfileOpen, setEditProfileOpen] = useState(false);
const [availabilityOpen, setAvailabilityOpen] = useState(false);
const [notificationsOpen, setNotificationsOpen] = useState(false);
```

### **Step 3: Update the "Edit Profile" Button**

Find this button (around line 145):

```typescript
<Button variant="outline" size="sm" className="w-full">
  <Settings className="h-4 w-4 mr-2" />
  Edit Profile
</Button>
```

Replace it with:

```typescript
<Button 
  variant="outline" 
  size="sm" 
  className="w-full"
  onClick={() => setEditProfileOpen(true)}
>
  <Settings className="h-4 w-4 mr-2" />
  Edit Profile
</Button>
```

### **Step 4: Update the "Update Availability" Button**

Find this button (around line 225):

```typescript
<Button className="w-full">
  Update Availability
</Button>
```

Replace it with:

```typescript
<Button 
  className="w-full"
  onClick={() => setAvailabilityOpen(true)}
>
  Update Availability
</Button>
```

### **Step 5: Update the "Notification Settings" Button**

Find this button (around line 229):

```typescript
<Button variant="outline" className="w-full">
  <Bell className="h-4 w-4 mr-2" />
  Notification Settings
</Button>
```

Replace it with:

```typescript
<Button 
  variant="outline" 
  className="w-full"
  onClick={() => setNotificationsOpen(true)}
>
  <Bell className="h-4 w-4 mr-2" />
  Notification Settings
</Button>
```

### **Step 6: Add Dialog Components**

At the very end of the Profile component, just before the closing `</div>` tags (around line 370), add:

```typescript
      {/* Dialogs */}
      {user && (
        <>
          <EditProfileDialog
            open={editProfileOpen}
            onOpenChange={setEditProfileOpen}
            currentProfile={profile}
            userId={user.id}
            onProfileUpdated={fetchUserData}
          />

          <AvailabilityDialog
            open={availabilityOpen}
            onOpenChange={setAvailabilityOpen}
            userId={user.id}
            onAvailabilityUpdated={fetchUserData}
          />

          <NotificationSettingsDialog
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
            userId={user.id}
          />
        </>
      )}
```

---

## 📋 **Database Schema Requirements**

Make sure your Supabase database has these columns:

### **`profiles` table:**
- `id` (uuid, primary key)
- `full_name` (text)
- `phone` (text)
- `blood_group` (text)
- `district` (text)
- `location` (text)
- `notification_preferences` (jsonb) - **NEW**
- `created_at` (timestamp)
- `updated_at` (timestamp)

### **`donors` table:**
- `id` (uuid, primary key)
- `profile_id` (uuid, foreign key to profiles)
- `is_available` (boolean)
- `availability_notes` (text) - **NEW**
- `created_at` (timestamp)
- `updated_at` (timestamp)
- ... (other donor fields)

### **SQL to Add Missing Columns:**

If you need to add the new columns, run this in Supabase SQL Editor:

```sql
-- Add availability_notes to donors table
ALTER TABLE donors 
ADD COLUMN IF NOT EXISTS availability_notes TEXT;

-- Add notification_preferences to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "email_notifications": true,
  "sms_notifications": false,
  "urgent_requests": true,
  "donation_reminders": true,
  "marketing_emails": false
}'::jsonb;
```

---

## 🎯 **Features Included**

### **1. Edit Profile Dialog**
- ✅ Update full name
- ✅ Update phone number
- ✅ Change blood group
- ✅ Change district
- ✅ Update detailed location
- ✅ Form validation
- ✅ Success/error toasts

### **2. Availability Dialog**
- ✅ Toggle availability status (available/unavailable)
- ✅ Add availability notes (e.g., "Available on weekends only")
- ✅ Visual feedback (green checkmark when available)
- ✅ Checks if user is registered as donor
- ✅ Shows helpful message if not a donor yet

### **3. Notification Settings Dialog**
- ✅ Email notifications toggle
- ✅ SMS notifications toggle
- ✅ Urgent requests alerts
- ✅ Donation reminders
- ✅ Marketing emails opt-in/out
- ✅ Saves preferences to database

---

## 🧪 **Testing Checklist**

### **Test Edit Profile:**
1. Click "Edit Profile" button
2. Dialog should open
3. Change your name, phone, blood group, etc.
4. Click "Save Changes"
5. Should see success toast
6. Profile should update immediately

### **Test Availability (If you're a donor):**
1. Click "Update Availability" button
2. Dialog should open
3. Toggle the availability switch
4. Add some notes (optional)
5. Click "Update Availability"
6. Should see success toast

### **Test Availability (If you're NOT a donor):**
1. Click "Update Availability" button
2. Should see message: "Not Registered as Donor"
3. Should prompt to register as donor first

### **Test Notification Settings:**
1. Click "Notification Settings" button
2. Dialog should open with current preferences
3. Toggle some switches
4. Click "Save Preferences"
5. Should see success toast
6. Preferences should be saved

---

## 🐛 **Troubleshooting**

### **Issue: "Edit Profile" button doesn't work**
**Solution:** Make sure you added the `onClick` handler and state variable.

### **Issue: Dialog doesn't open**
**Solution:** Check that you added the dialog components at the end of the Profile component.

### **Issue: "Column does not exist" error**
**Solution:** Run the SQL commands above to add missing columns to your database.

### **Issue: Changes don't save**
**Solution:** Check browser console for errors. Verify Supabase connection and table permissions.

### **Issue: "Not a donor" message when I am a donor**
**Solution:** Check that your `profile_id` in the `donors` table matches your user ID.

---

## 📝 **Quick Implementation Steps**

1. ✅ **Components created** (already done)
2. ⏳ **Add imports** to Profile.tsx (Step 1)
3. ⏳ **Add state variables** (Step 2)
4. ⏳ **Update button onClick handlers** (Steps 3-5)
5. ⏳ **Add dialog components** (Step 6)
6. ⏳ **Run SQL** to add missing columns (if needed)
7. ⏳ **Test** all features

**Estimated Time:** 10-15 minutes

---

## ✨ **Additional Features You Can Add Later**

- 📸 Profile picture upload
- 📅 Last donation date tracking
- 🏆 Achievement badges
- 📊 Donation statistics
- 🔔 Real-time notifications
- 📱 Mobile app integration
- 🌍 Location-based matching
- ⭐ Donor ratings/reviews

---

## 🎉 **Benefits**

After implementing these features, users will be able to:

- ✅ **Update their profile** anytime
- ✅ **Control their availability** as donors
- ✅ **Manage notifications** to avoid spam
- ✅ **Have a better user experience**
- ✅ **Feel more in control** of their data

---

**Last Updated:** 2025-11-21 1:46 PM
**Status:** Components ready ✅ | Integration pending ⏳

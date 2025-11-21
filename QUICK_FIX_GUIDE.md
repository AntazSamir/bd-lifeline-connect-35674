# Quick Fix Guide - Apply These Changes Manually

## ✅ COMPLETED
- Created `src/lib/logger.ts`

## 🔧 APPLY THESE FIXES MANUALLY

### Fix 1: src/hooks/useDatabase.ts

**Line 1:** Change
```typescript
import { useState, useEffect } from 'react'
```
To:
```typescript
import { useState, useEffect, useMemo } from 'react'
```

**Line 2:** After the supabase import, add:
```typescript
import { logger } from '@/lib/logger'
```

**Line ~117:** Change
```typescript
console.log('🔴 Setting up real-time subscription for donors table')
```
To:
```typescript
logger.debug('🔴 Setting up real-time subscription for donors table')
```

**Line ~128:** Change
```typescript
console.log('🔴 Real-time update received:', payload)
```
To:
```typescript
logger.debug('🔴 Real-time update received:', payload)
```

**Line ~134:** Change
```typescript
console.log('➕ New donor added:', payload.new)
```
To:
```typescript
logger.debug('➕ New donor added:', payload.new)
```

**Line ~137:** Change
```typescript
console.log('✏️ Donor updated:', payload.new)
```
To:
```typescript
logger.debug('✏️ Donor updated:', payload.new)
```

**Line ~144:** Change
```typescript
console.log('🗑️ Donor deleted:', payload.old)
```
To:
```typescript
logger.debug('🗑️ Donor deleted:', payload.old)
```

**Line ~152:** Change
```typescript
console.log('🔴 Subscription status:', status)
```
To:
```typescript
logger.debug('🔴 Subscription status:', status)
```

**Line ~157:** Change
```typescript
console.log('🔴 Cleaning up real-time subscription')
```
To:
```typescript
logger.debug('🔴 Cleaning up real-time subscription')
```

---

### Fix 2: src/pages/SignIn.tsx

**Add import at top:**
```typescript
import { logger } from '@/lib/logger';
```

**Line ~39:** Change
```typescript
} catch (error: any) {
  toast({
    title: "Error",
    description: error.message || "Failed to sign in",
    variant: "destructive",
  });
}
```
To:
```typescript
} catch (error) {
  const message = error instanceof Error ? error.message : 'Failed to sign in';
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
}
```

**Line ~53:** Same pattern for Google sign-in error handler

**Line ~86:** Same pattern for password reset error handler

---

### Fix 3: src/pages/SignUp.tsx

**Add import at top:**
```typescript
import { logger } from '@/lib/logger';
```

**Line ~59:** Change
```typescript
} catch (error: any) {
  toast({
    title: "Error",
    description: error.message || "Failed to create account",
    variant: "destructive",
  });
}
```
To:
```typescript
} catch (error) {
  const message = error instanceof Error ? error.message : 'Failed to create account';
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
}
```

**Line ~60:** Change
```typescript
console.error("Profile creation error:", profileError);
```
To:
```typescript
logger.error("Profile creation error:", profileError);
```

---

### Fix 4: src/pages/Profile.tsx

**Add import at top:**
```typescript
import { logger } from '@/lib/logger';
```

**Line ~50:** Change
```typescript
console.error("Error fetching user data:", error);
```
To:
```typescript
logger.error("Error fetching user data:", error);
```

---

### Fix 5: src/pages/FindDonors.tsx

**Line ~91:** Change
```typescript
const matchesDistance = filters.distance ? true : true; // TODO: Implement distance calculation
```
To:
```typescript
// Distance filter disabled until geolocation is implemented
const matchesDistance = true;
```

**Lines ~274-291:** Comment out the entire distance filter UI section:
```typescript
{/* Distance Filter - Coming Soon
<div className={`p-3 rounded-lg...`}>
  ...entire distance filter section...
</div>
*/}
```

---

## 🎯 Summary

**Total files to fix:** 5
- useDatabase.ts (7 console.log → logger.debug, add imports)
- SignIn.tsx (3 error handlers, fix `any` type)
- SignUp.tsx (2 fixes: error handler + console.error)
- Profile.tsx (1 console.error → logger.error)
- FindDonors.tsx (disable distance filter)

**Estimated time:** 10-15 minutes

**Priority:** Do useDatabase.ts first (most critical for performance)

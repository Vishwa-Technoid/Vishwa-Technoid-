# How to Access Your Firebase Project and Fix CORS Error

## Step 1: Access Firebase Console

Since you're the owner, follow these steps:

### 🔗 Direct Links

1. **Open Firebase Console**: https://console.firebase.google.com/
2. **Login with the Google account** you used to create the project
3. You should see your project: **smart-attendance-system-f15d5**

### If You Don't See Your Project:
- Make sure you're logged in with the correct Google account
- Check if you're in the right organization (top-left dropdown)
- The project might be in a different account - check all your Google accounts

---

## Step 2: Fix Authorized Domains (Main Fix)

Once you access the project:

### Navigate to Authentication Settings:
1. Click on **Authentication** (left sidebar)
2. Click on **Settings** tab at the top
3. Scroll down to **Authorized domains** section
4. You should see something like:
   ```
   smart-attendance-system-f15d5.firebaseapp.com
   smart-attendance-system-f15d5.web.app
   ```

### Add localhost:
5. Click **Add domain** button
6. Type: `localhost`
7. Click **Add**

✅ **This should immediately fix your CORS error!**

---

## Step 3: (Optional) Check API Key Restrictions

If the above doesn't work, check API key restrictions:

### Navigate to Google Cloud Console:
1. **Open**: https://console.cloud.google.com/
2. Select project: **smart-attendance-system-f15d5**
3. Go to: **APIs & Services** → **Credentials**
4. Find your API key: `AIzaSyDinq9zhri-Bwb59-Ht9VHaz0wr6_8VYhk`
5. Click on it

### Check Restrictions:
- **Application restrictions**: Should be **None** (for development)
- If it says "HTTP referrers", you need to add:
  - `localhost/*`
  - `http://localhost:*/*`
  
### Save Changes

---

## Step 4: Test the Fix

1. **Close all browser tabs** with your app
2. **Clear browser cache**: Ctrl+Shift+Delete → Clear cached images and files
3. **Restart the frontend**: 
   ```bash
   # Stop the current npm run dev (Ctrl+C)
   npm run dev
   ```
4. **Open browser** to the new URL
5. **Try to register** a new user
6. **Check console** - CORS error should be gone!

---

## Alternative: If You Really Can't Access Console

If you absolutely cannot access the Firebase Console, here's what we can do:

### Option 1: Browser-Based Workaround (Temporary)
Install a CORS browser extension (NOT RECOMMENDED for production):
- Install "CORS Unblock" extension for Chrome
- Enable it only for development
- ⚠️ This is a temporary hack, not a real solution

### Option 2: Use Firebase CLI to Check Access
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# List your projects
firebase projects:list
```

If you see your project listed, you have access! Then:
```bash
# Set the current project
firebase use smart-attendance-system-f15d5

# This will help verify you have access
firebase apps:list
```

---

## Quick Checklist

- [ ] Open https://console.firebase.google.com/
- [ ] Login with your Google account
- [ ] Find project: smart-attendance-system-f15d5
- [ ] Go to Authentication → Settings
- [ ] Add `localhost` to Authorized domains
- [ ] Clear browser cache
- [ ] Test registration

---

## Expected Result

After adding `localhost` to authorized domains:

✅ **Before**: 
```
Access to fetch at 'identitytoolkit.googleapis.com' blocked by CORS
```

✅ **After**:
```
User registered successfully!
Redirected to dashboard
```

Let me know once you've added `localhost` to authorized domains and we can test!

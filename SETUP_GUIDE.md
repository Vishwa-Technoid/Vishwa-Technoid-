# 🚀 Quick Setup Guide - Smart Attendance System

## ⚡ Prerequisites
- Node.js 18+ installed
- Firebase account (free tier works)

## 🔥 Firebase Setup (5 minutes)

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add Project"
3. Name: "Smart Attendance System"
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Email/Password Authentication
1. In Firebase Console, click "Authentication" in left menu
2. Click "Get Started"
3. Click "Email/Password" in Sign-in providers
4. Toggle "Enable" switch
5. Click "Save"

### 3. Create Firestore Database
1. Click "Firestore Database" in left menu
2. Click "Create database"
3. Select "Start in test mode"
4. Choose location (closest to you)
5. Click "Enable"

### 4. Get Web Config (Frontend)
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the Web icon `</>`
4. Register app name: "Attendance Web"
5. Copy the `firebaseConfig` object
6. **Save this - you'll need it soon!**

Example config:
```javascript
{
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghij1234567890"
}
```

### 5. Get Service Account (Backend)
1. Still in Project Settings
2. Click "Service Accounts" tab
3. Click "Generate new private key"
4. Click "Generate key" (downloads JSON file)
5. **Keep this file secure!**

---

## 💻 Application Setup

### Frontend Configuration

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Update Firebase config:**
   Open `src/services/firebase.js` in any text editor
   
   Find this section (around line 13):
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY_HERE",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     // ...
   };
   ```
   
   Replace with YOUR config from Step 4 above.

3. **Dependencies already installed!** But if needed:
   ```bash
   npm install
   ```

4. **Start frontend:**
   ```bash
   npm run dev
   ```
   Opens at http://localhost:5173

### Backend Configuration

1. **Open new terminal, navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create `.env` file:**
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env    # Windows
   cp .env.example .env      # Mac/Linux
   ```

3. **Edit `.env` file:**
   Open `backend/.env` in text editor
   
   From the service account JSON you downloaded:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_long_private_key_here\n-----END PRIVATE KEY-----\n"
   PORT=3000
   ```
   
   **IMPORTANT:** The private key must be in quotes and keep the `\n` characters!

4. **Dependencies already installed!** But if needed:
   ```bash
   npm install
   ```

5. **Start backend:**
   ```bash
   npm start
   ```
   Runs at http://localhost:3000

---

## ✅ Verify Setup

### Test Backend
Open http://localhost:3000/api/health in browser

Should see:
```json
{
  "success": true,
  "message": "Smart Attendance System API is running",
  "timestamp": "2026-01-12T..."
}
```

### Test Frontend
1. Open http://localhost:5173
2. Should see beautiful login page
3. Click "Register here"
4. Create account (Teacher role)
5. If redirects to dashboard → **Success!** ✅

---

## 🎯 First Use

### As Teacher:
1. Login/Register as Teacher
2. Click "Create New Session"
3. Enter course name
4. Click "Use My Current Location"
5. Set radius: 50 meters
6. Set duration: 15 minutes
7. Click "Generate QR Code"
8. QR code appears! ✨

### As Student:
1. Open http://localhost:5173 in **incognito/private window**
2. Register as Student
3. Click "Scan QR" tab
4. Allow camera and location permissions
5. Point camera at QR code from teacher screen
6. Attendance marked! ✅

---

## 🐛 Common Issues

### "Module not found: firebase"
- Run `npm install` in frontend folder

### "Error: Firebase API key invalid"
- Check `src/services/firebase.js` config is correct
- Make sure you copied from Firebase Console exactly

### "Error: Firebase Admin auth error"
- Check `backend/.env` file exists
- Verify private key is in quotes with `\n` characters
- Make sure no extra spaces

### QR Scanner not opening
- Allow camera permissions
- Use Chrome/Edge (best support)
- Must be localhost or HTTPS

### "Location not available"
- Allow location permissions
- Check GPS is enabled
- Test on mobile for better GPS

---

## 📱 Testing Tips

- Use two browsers (one for teacher, one for student)
- Or use normal + incognito windows
- Mobile phones work great for students!
- QR code works from phone to screen too

---

## 🎓 You're Ready!

Both servers running?
- ✅ Frontend: http://localhost:5173
- ✅ Backend: http://localhost:3000

Firebase configured?
- ✅ Authentication enabled
- ✅ Firestore created
- ✅ Config added to code

**You're all set! Start testing the app! 🚀**

---

For detailed documentation, see:
- [README.md](file:///c:/Users/mayur/OneDrive/Desktop/Smart%20Attendance%20System%20(QR%20+%20Location%20Based)/README.md) - Complete guide
- [walkthrough.md](file:///C:/Users/mayur/.gemini/antigravity/brain/c397c074-3ec5-41ef-a72b-4c9bc15c9a95/walkthrough.md) - Technical details

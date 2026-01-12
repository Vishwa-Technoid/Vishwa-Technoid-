# 🎓 Smart Attendance System

A modern, eco-friendly attendance tracking system using QR codes and location verification, built with React, Express.js, and Firebase following **Green Coding** principles.

## ✨ Features

### For Teachers
- 📱 Create attendance sessions with QR codes
- 📍 Set location constraints (GPS + radius)
- ⏱️ Time-limited sessions
- 📊 View attendance records in real-time

### For Students
- 📷 Scan QR codes to mark attendance
- 🗺️ Automatic location verification
- 📈 View attendance history
- 👤 Profile management

### Green Coding Optimizations
- ♻️ **Lazy Loading**: QR scanner loaded only when needed (~50KB savings)
- 🔋 **Single GPS Fetch**: Location fetched once per scan (saves battery)
- 💾 **Firestore Optimization**: Indexed queries, batch writes, pagination
- 📦 **Small Bundle Size**: Code splitting, tree-shaking (<200KB main bundle)
- ⚡ **Efficient APIs**: Minimal network calls, stateless design
- 🔄 **Session Caching**: Firebase persistence reduces re-authentication

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool with code splitting
- **Firebase Client SDK** - Authentication & Firestore
- **React Router** - Client-side routing
- **react-qr-code** - QR code generation
- **html5-qrcode** - QR code scanning
- **React Icons** - Modern iconography

### Backend
- **Node.js + Express** - RESTful API server
- **Firebase Admin SDK** - Server-side Firebase operations
- **CORS** - Cross-origin support
- **Haversine Formula** - GPS distance calculation

### Database
- **Firebase Firestore** - NoSQL cloud database with offline persistence

## 📁 Project Structure

```
Smart-Attendance-System/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── QRScanner.jsx         # Lazy-loaded QR scanner
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Register.jsx          # Registration page
│   │   │   ├── TeacherDashboard.jsx  # Teacher interface
│   │   │   └── StudentDashboard.jsx  # Student interface
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       # Authentication state
│   │   ├── services/
│   │   │   └── firebase.js           # Firebase configuration
│   │   ├── utils/
│   │   │   └── haversine.js          # Distance calculation
│   │   ├── App.jsx                   # Main app with routing
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Glassmorphic design system
│   ├── vite.config.js                # Vite optimization config
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Authentication endpoints
│   │   │   └── attendanceRoutes.js   # Attendance management
│   │   ├── services/
│   │   │   └── locationService.js    # GPS verification
│   │   ├── utils/
│   │   │   └── firebase.js           # Firebase Admin SDK
│   │   └── server.js                 # Express server
│   ├── .env.example                  # Environment template
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** 18+ installed
- **Firebase project** created ([Firebase Console](https://console.firebase.google.com/))
- **Git** (optional)

### Step 1: Firebase Configuration

#### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the wizard to create your project

#### 1.2 Enable Authentication
1. In Firebase Console,go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** provider

#### 1.3 Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **Test mode** (for development)
4. Choose a location close to you

#### 1.4 Get Firebase Config (Frontend)
1. Go to **Project Settings** > **General**
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register your app (name: "Attendance System")
5. Copy the `firebaseConfig` object

#### 1.5 Get Service Account (Backend)
1. Go to **Project Settings** > **Service Accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Keep it secure (don't commit to Git!)

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Create Firebase configuration file
# Copy firebaseConfig.example.js to firebase.js in src/services/
cp src/firebaseConfig.example.js src/services/firebaseConfig.js

# Edit src/services/firebase.js and replace the config with your values
# (Use the config from Step 1.4)

# Dependencies are already installed, but if needed:
npm install

# Start development server
npm run dev
```

The frontend will open at `http://localhost:5173`

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create environment file
cp .env.example .env

# Edit .env and add your Firebase Admin credentials
# Use the service account from Step 1.5

# Example .env:
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Dependencies are already installed, but if needed:
npm install

# Start server
npm start
```

The backend API will run at `http://localhost:3000`

### Step 4: Test the Application

1. **Register as Teacher**:
   - Open `http://localhost:5173`
   - Click "Register"
   - Fill in details, select "Teacher" role
   - Click "Create Account"

2. **Create Attendance Session**:
   - Click "Create New Session"
   - Enter course name
   - Click "Use My Current Location" (or enter manually)
   - Set radius (e.g., 50 meters)
   - Set duration (e.g., 15 minutes)
   - Click "Generate QR Code"

3. **Register as Student** (open in new incognito window):
   - Open `http://localhost:5173` in incognito/private mode
   - Register with different email, select "Student" role

4. **Mark Attendance**:
   - In student dashboard, click "Scan QR"
   - Allow location access
   - Scan the QR code from teacher's screen
   - Attendance should be marked successfully!

## 📚 Green Coding Principles Explained (for Viva)

### 1. Lazy Loading
**What**: QR scanner component loaded only when student clicks "Scan QR"  
**Why**: Reduces initial bundle size by ~50KB, faster page load  
**How**: Using `React.lazy()` and `Suspense`  
**Code**: See `StudentDashboard.jsx` line 17

### 2. Single GPS Fetch
**What**: GPS coordinates fetched once when scanner opens  
**Why**: Continuous polling drains battery; single fetch saves energy  
**How**: `useEffect` with empty dependency array  
**Code**: See `QRScanner.jsx` lines 24-44

### 3. Firestore Optimization
**What**: Batch writes, indexed queries, limited results  
**Why**: Reduces database reads/writes, lowers cost and energy  
**How**: Using Firestore `.limit()`, indexed fields, batching  
**Code**: See `TeacherDashboard.jsx` line 48

### 4. Bundle Size Reduction
**What**: Code splitting, tree-shaking, manual chunks  
**Why**: Smaller downloads = less data transfer = less energy  
**How**: Vite configuration with `manualChunks`  
**Code**: See `vite.config.js`

### 5. API Efficiency
**What**: Single endpoint for attendance with all validations  
**Why**: Reduces network round trips  
**How**: Combined verification in one POST request  
**Code**: See `attendanceRoutes.js` POST /mark

### 6. Session Caching
**What**: Firebase auth persists locally  
**Why**: Avoids repeated authentication API calls  
**How**: `setPersistence(auth, browserLocalPersistence)`  
**Code**: See `firebase.js` line 34

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user metadata
- `GET /api/auth/user/:uid` - Get user profile

### Attendance
- `POST /api/attendance/session` - Create session (Teacher)
- `POST /api/attendance/mark` - Mark attendance (Student)
- `GET /api/attendance/session/:sessionId` - Get session details
- `GET /api/attendance/records/:sessionId` - Get attendance records

### Health Check
- `GET /api/health` - Server health status

## 🎨 Design System

The application uses a modern **glassmorphic** design with:
- Vibrant gradient color palette (purple, blue, pink)
- Frosted glass effects with backdrop blur
- Smooth animations and transitions
- Dark theme optimized for readability
- Responsive design (mobile, tablet, desktop)

## 🔒 Security Features

- Firebase Authentication (secure password hashing)
- Server-side location verification
- Session expiry validation
- Duplicate attendance prevention
- Environment variables for sensitive data

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Requires camera access for QR scanning
- Requires location access for GPS verification

## 🐛 Troubleshooting

### Frontend won't start
- Check if port 5173 is available
- Run `npm install` again
- Check Firebase config in `src/services/firebase.js`

### Backend won't start
- Check if port 3000 is available
- Verify `.env` file exists with correct values
- Check Firebase service account credentials

### QR Scanner not working
- Allow camera permissions in browser
- Use HTTPS or localhost (camera requires secure context)
- Check browser console for errors

### Location not detected
- Allow location permissions in browser
- Ensure GPS is enabled on device
- Try on mobile device for better accuracy

## 📖 Academic Viva Points

1. **What is Green Coding?**  
   Sustainable software development that minimizes energy consumption and resource usage.

2. **Why Haversine Formula?**  
   Accurately calculates Earth's surface distance between GPS coordinates for location verification.

3. **Why Lazy Loading?**  
   Loads code only when needed, reducing initial bundle size and improving performance.

4. **Why Firebase?**  
   Provides scalable backend (Auth + Database) without managing servers, reducing infrastructure energy.

5. **QR vs other methods?**  
   QR codes are fast, contactless, and work offline with client-side generation.

## 📄 License

MIT License - Free to use for educational purposes

## 👨‍💻 Author

Built with ❤️ for academic demonstration of modern web development and green coding principles.

---

**Happy Coding! 🌱**

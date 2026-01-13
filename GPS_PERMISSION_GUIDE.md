# GPS/Location Permission Guide

## Browser Location Permissions Required

This Smart Attendance System requires GPS location access to verify that students are physically present in the classroom. Here's what you need to know:

## For Students Using the App

### 1. **Browser Permissions** 
When you first try to scan a QR code, your browser will ask for location permission:
- **Chrome/Edge**: Click "Allow" when prompted
- **Firefox**: Click "Allow" when prompted  
- **Safari**: Click "Allow" when prompted

### 2. **If Permission Was Denied**
If you accidentally clicked "Block" or "Deny":

#### **Chrome/Edge**
1. Click the lock icon 🔒 in the address bar
2. Find "Location" in the permissions list
3. Change from "Block" to "Allow"
4. Refresh the page

#### **Firefox**
1. Click the lock icon 🔒 in the address bar
2. Click "Connection secure" → "More information"
3. Go to "Permissions" tab
4. Find "Access Your Location" and check "Allow"
5. Refresh the page

#### **Safari (Mac)**
1. Safari menu → Preferences → Websites
2. Find "Location" in the left sidebar
3. Find your attendance website and set to "Allow"
4. Refresh the page

### 3. **Mobile Devices**

#### **Android (Chrome)**
1. Settings → Apps → Chrome → Permissions
2. Enable "Location"
3. Make sure "Location Services" is ON in Android Settings

#### **iOS (Safari)**
1. Settings → Safari → Location
2. Set to "Ask" or "Allow"
3. Settings → Privacy → Location Services must be ON

## For Teachers

When creating a session, you can:
1. Click **"Use My Current Location"** button - This will automatically get your GPS coordinates
2. **Manual Entry** - Enter latitude and longitude manually if needed

### Getting Coordinates Manually

If you need to enter coordinates manually:
1. Open Google Maps
2. Right-click on your classroom location
3. Click the coordinates (e.g., "18.516726, 73.856255")
4. Paste into the form

## Troubleshooting

### "Unable to get your location" Error

**Possible causes:**
1. ❌ Location permission denied in browser
2. ❌ Location Services disabled on device
3. ❌ Using HTTP instead of HTTPS (browsers block location on HTTP)
4. ❌ No GPS signal (indoors, basement, etc.)

**Solutions:**
✅ Enable location permissions (see above)
✅ Move to a window or area with better GPS signal
✅ For testing: Use a device with better GPS (phone > laptop)
✅ Make sure you're using HTTPS (or localhost for development)

### "You are 19490m away" Error

This usually means:
1. **Teacher entered wrong coordinates** - Verify the classroom coordinates are correct
2. **Old session** - Teacher may have created session from a different location
3. **GPS accuracy issue** - Wait a few seconds for GPS to get more accurate
4. **Spoofed location** - Some browser extensions fake location

**How to verify:**
- The error message now shows BOTH your location AND the classroom location
- Copy both coordinates into Google Maps to see where they actually are
- If classroom location is wrong, teacher needs to create a new session with correct coordinates

## Privacy Note

🔒 Your location is only:
- Captured ONCE when you scan the QR code
- Used ONLY to verify you're in the classroom
- Stored with attendance record (distance from classroom)
- NOT tracked continuously
- NOT shared with third parties

This is a GREEN CODING practice - we minimize location requests to save battery and respect privacy!

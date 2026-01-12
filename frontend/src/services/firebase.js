/**
 * Firebase Service - Client SDK Configuration
 * 
 * GREEN CODING PRINCIPLE:
 * - Initialize Firebase once and export configured instances
 * - Use IndexedDB persistence to cache auth state (reduces re-authentication)
 * - Minimizes network calls by maintaining session
 * 
 * VIVA EXPLANATION:
 * This module initializes Firebase services (Authentication and Firestore).
 * We enable offline persistence to reduce unnecessary network requests,
 * following green coding principles by caching data locally.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase Configuration - Connected to your project!
const firebaseConfig = {
    apiKey: "AIzaSyDinq9zhri-Bwb59-Ht9VHaz0wr6_8VYhk",
    authDomain: "smart-attendance-system-f15d5.firebaseapp.com",
    projectId: "smart-attendance-system-f15d5",
    storageBucket: "smart-attendance-system-f15d5.firebasestorage.app",
    messagingSenderId: "764933602756",
    appId: "1:764933602756:web:bcc6720c32eaf68cb37891"
};

// Initialize Firebase App (singleton pattern - only initialized once)
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// GREEN CODING: Set authentication persistence to LOCAL
// This keeps the user logged in across browser sessions
// Reduces repeated authentication API calls
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error('Auth persistence error:', error);
    });

// Initialize Firestore Database
export const db = getFirestore(app);

// GREEN CODING: Enable offline persistence for Firestore
// Caches data locally to reduce network requests
// Data is synced automatically when online
enableIndexedDbPersistence(db)
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.warn('Persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            // Browser doesn't support persistence
            console.warn('Persistence not supported by this browser');
        }
    });

export default app;

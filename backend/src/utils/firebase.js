/**
 * Firebase Admin SDK Initialization
 * 
 * PURPOSE:
 * Initialize Firebase Admin for backend operations
 * 
 * GREEN CODING:
 * - Singleton pattern (initialize once, use everywhere)
 * - No continuous connections (Firestore auto-manages)
 * 
 * VIVA EXPLANATION:
 * Firebase Admin SDK is used on the backend for:
 * 1. Verifying JWT tokens from clients
 * 2. Reading/writing to Firestore database
 * 3. Server-side user management
 */

import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin with service account
// NOTE: In production, use a service account JSON file
// For development, we'll use environment variables
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

// Initialize Firebase Admin (singleton)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
}

export const auth = admin.auth();
export const db = admin.firestore();

export default admin;

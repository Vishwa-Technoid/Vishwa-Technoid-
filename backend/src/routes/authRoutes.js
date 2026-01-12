/**
 * Authentication Routes
 * 
 * ENDPOINTS:
 * - POST /api/auth/register - Register new user
 * - POST /api/auth/login - Login user (handled by Firebase client SDK)
 * - POST /api/auth/verify - Verify Firebase token
 * 
 * GREEN CODING:
 * - Minimal endpoints (most auth handled by Firebase client SDK)
 * - No session storage on server (stateless, Firebase manages sessions)
 */

import express from 'express';
import { db } from '../utils/firebase.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user (additional metadata storage)
 * Note: Firebase Authentication is handled on frontend
 * This endpoint just stores additional user data in Firestore
 */
router.post('/register', async (req, res) => {
    try {
        const { uid, email, name, role } = req.body;

        if (!uid || !email || !name || !role) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Store user profile in Firestore
        await db.collection('users').doc(uid).set({
            uid,
            email,
            name,
            role,
            createdAt: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/auth/user/:uid
 * Get user profile data
 */
router.get('/user/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: userDoc.data()
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;

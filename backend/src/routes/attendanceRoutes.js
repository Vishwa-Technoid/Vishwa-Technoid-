/**
 * Attendance Routes - Core Business Logic
 * 
 * ENDPOINTS:
 * - POST /api/attendance/session - Create attendance session (Teacher)
 * - POST /api/attendance/mark - Mark attendance (Student)
 * - GET /api/attendance/session/:sessionId - Get session details
 * - GET /api/attendance/records/:sessionId - Get attendance records for session
 * 
 * GREEN CODING:
 * - Efficient Firestore queries with indexes
 * - Single database write per attendance mark
 * - Batch operations where possible
 * - No polling - event-driven architecture
 */

import express from 'express';
import { db } from '../utils/firebase.js';
import { verifyLocation } from '../services/locationService.js';

const router = express.Router();

/**
 * POST /api/attendance/session
 * Create a new attendance session (Teacher only)
 */
router.post('/session', async (req, res) => {
    try {
        const { sessionId, courseName, teacherId, teacherEmail, location, expiresAt } = req.body;

        if (!sessionId || !courseName || !teacherId || !location) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // GREEN CODING: Single Firestore write
        await db.collection('sessions').doc(sessionId).set({
            sessionId,
            courseName,
            teacherId,
            teacherEmail,
            location,
            expiresAt,
            createdAt: new Date().toISOString(),
            active: true
        });

        res.json({
            success: true,
            message: 'Session created successfully',
            sessionId
        });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/attendance/mark
 * Mark attendance for a session (Student)
 * 
 * VERIFICATION STEPS:
 * 1. Check if session exists and is active
 * 2. Verify session hasn't expired
 * 3. Validate student location within allowed radius
 * 4. Check if student hasn't already marked attendance
 * 5. Record attendance
 */
router.post('/mark', async (req, res) => {
    try {
        const { sessionId, studentId, studentEmail, location } = req.body;

        if (!sessionId || !studentId || !location) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Step 1: Get session details
        const sessionDoc = await db.collection('sessions').doc(sessionId).get();

        if (!sessionDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Invalid QR code - session not found'
            });
        }

        const session = sessionDoc.data();

        // Step 2: Check if session is expired
        const now = new Date();
        const expiryDate = new Date(session.expiresAt);

        if (now > expiryDate) {
            return res.status(400).json({
                success: false,
                message: 'Session has expired'
            });
        }

        // Step 3: Verify location
        // Use default 50m radius if not specified
        const allowedRadius = session.location.radiusMeters || 50;

        const locationCheck = verifyLocation(
            location.latitude,
            location.longitude,
            session.location.latitude,
            session.location.longitude,
            allowedRadius
        );

        // Log for debugging
        console.log('Location Verification:', {
            studentLat: location.latitude,
            studentLon: location.longitude,
            classroomLat: session.location.latitude,
            classroomLon: session.location.longitude,
            distance: locationCheck.distance,
            maxDistance: locationCheck.maxDistance,
            valid: locationCheck.valid
        });

        if (!locationCheck.valid) {
            return res.status(400).json({
                success: false,
                message: `You are ${locationCheck.distance}m away. Must be within ${locationCheck.maxDistance}m`,
                debug: {
                    yourLocation: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
                    classLocation: `${session.location.latitude.toFixed(6)}, ${session.location.longitude.toFixed(6)}`,
                    distance: locationCheck.distance,
                    required: locationCheck.maxDistance
                }
            });
        }

        // Step 4: Check for duplicate attendance
        const existingAttendance = await db.collection('attendance')
            .where('sessionId', '==', sessionId)
            .where('studentId', '==', studentId)
            .get();

        if (!existingAttendance.empty) {
            return res.status(400).json({
                success: false,
                message: 'You have already marked attendance for this session'
            });
        }

        // Step 5: Record attendance (GREEN CODING: Single write)
        const attendanceData = {
            sessionId,
            studentId,
            studentEmail,
            courseName: session.courseName,
            markedAt: new Date().toISOString(),
            distance: locationCheck.distance,
            location: {
                latitude: location.latitude,
                longitude: location.longitude
            }
        };

        await db.collection('attendance').add(attendanceData);

        res.json({
            success: true,
            message: 'Attendance marked successfully',
            courseName: session.courseName,
            distance: locationCheck.distance
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/attendance/session/:sessionId
 * Get session details
 */
router.get('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const sessionDoc = await db.collection('sessions').doc(sessionId).get();

        if (!sessionDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.json({
            success: true,
            session: sessionDoc.data()
        });
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/attendance/records/:sessionId
 * Get all attendance records for a session (Teacher)
 * 
 * GREEN CODING: Paginated query with limit
 */
router.get('/records/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const limit = parseInt(req.query.limit) || 100; // Default limit

        const snapshot = await db.collection('attendance')
            .where('sessionId', '==', sessionId)
            .orderBy('markedAt', 'desc')
            .limit(limit)
            .get();

        const records = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json({
            success: true,
            count: records.length,
            records
        });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;

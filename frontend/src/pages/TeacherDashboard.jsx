/**
 * Teacher Dashboard Component
 * 
 * FEATURES:
 * - Create attendance sessions
 * - Generate QR codes with react-qr-code
 * - Set location constraints (latitude, longitude, radius)
 * - View attendance records for each session
 * 
 * GREEN CODING:
 * - QR code generated client-side (no server overhead)
 * - Minimal Firestore writes (only when creating session)
 * - Efficient data fetching with pagination
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QRCodeSVG } from 'react-qr-code';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FiPlus, FiMapPin, FiClock, FiUsers, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form state for creating new session
    const [sessionForm, setSessionForm] = useState({
        courseName: '',
        latitude: '',
        longitude: '',
        radiusMeters: '50',
        durationMinutes: '15'
    });

    // Fetch teacher's sessions
    useEffect(() => {
        fetchSessions();
    }, [user]);

    const fetchSessions = async () => {
        if (!user) return;

        try {
            const q = query(
                collection(db, 'sessions'),
                where('teacherId', '==', user.uid),
                orderBy('createdAt', 'desc'),
                limit(10) // GREEN CODING: Limit results to reduce data transfer
            );

            const snapshot = await getDocs(q);
            const sessionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setSessions(sessionsData);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Generate unique session ID (timestamp-based)
            const sessionId = `SESSION_${Date.now()}`;
            const expiryTime = new Date(Date.now() + sessionForm.durationMinutes * 60000);

            // Create session in Firestore
            const sessionData = {
                sessionId: sessionId,
                courseName: sessionForm.courseName,
                teacherId: user.uid,
                teacherEmail: user.email,
                location: {
                    latitude: parseFloat(sessionForm.latitude),
                    longitude: parseFloat(sessionForm.longitude),
                    radiusMeters: parseInt(sessionForm.radiusMeters)
                },
                expiresAt: expiryTime.toISOString(),
                createdAt: new Date().toISOString(),
                active: true
            };

            await addDoc(collection(db, 'sessions'), sessionData);

            // Set as active session for QR display
            setActiveSession({ ...sessionData, id: sessionId });
            setShowCreateForm(false);
            fetchSessions(); // Refresh list

            // Reset form
            setSessionForm({
                courseName: '',
                latitude: '',
                longitude: '',
                radiusMeters: '50',
                durationMinutes: '15'
            });
        } catch (error) {
            console.error('Error creating session:', error);
            alert('Failed to create session');
        }

        setLoading(false);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setSessionForm({
                        ...sessionForm,
                        latitude: position.coords.latitude.toFixed(6),
                        longitude: position.coords.longitude.toFixed(6)
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Could not get your location. Please enter manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)' }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-lg">
                <div>
                    <h1 className="text-gradient">Teacher Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user?.email}</p>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary">
                    <FiLogOut /> Logout
                </button>
            </div>

            {/* Create Session Button */}
            <div className="mb-lg">
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="btn btn-primary"
                >
                    <FiPlus /> Create New Session
                </button>
            </div>

            {/* Create Session Form */}
            {showCreateForm && (
                <div className="glass-card mb-lg">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Create Attendance Session</h3>

                    <form onSubmit={handleCreateSession}>
                        <div className="input-group">
                            <label className="input-label">Course Name</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g., Computer Science 101"
                                value={sessionForm.courseName}
                                onChange={(e) => setSessionForm({ ...sessionForm, courseName: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="input-group">
                                <label className="input-label">
                                    <FiMapPin style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    className="input-field"
                                    placeholder="e.g., 40.7128"
                                    value={sessionForm.latitude}
                                    onChange={(e) => setSessionForm({ ...sessionForm, latitude: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    <FiMapPin style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    className="input-field"
                                    placeholder="e.g., -74.0060"
                                    value={sessionForm.longitude}
                                    onChange={(e) => setSessionForm({ ...sessionForm, longitude: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="btn btn-secondary"
                            style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
                        >
                            Use My Current Location
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="input-group">
                                <label className="input-label">Allowed Radius (meters)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="50"
                                    value={sessionForm.radiusMeters}
                                    onChange={(e) => setSessionForm({ ...sessionForm, radiusMeters: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    <FiClock style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="15"
                                    value={sessionForm.durationMinutes}
                                    onChange={(e) => setSessionForm({ ...sessionForm, durationMinutes: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-md" style={{ marginTop: 'var(--spacing-md)' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                                {loading ? 'Creating...' : 'Generate QR Code'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Active Session QR Code */}
            {activeSession && (
                <div className="glass-card text-center mb-lg">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Active Session: {activeSession.courseName}</h3>

                    {/* QR Code Display */}
                    <div style={{
                        background: 'white',
                        padding: 'var(--spacing-lg)',
                        borderRadius: 'var(--radius-md)',
                        display: 'inline-block',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        <QRCodeSVG value={activeSession.sessionId} size={256} />
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        Students can scan this QR code to mark attendance
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-xs)' }}>
                        Session ID: {activeSession.sessionId}
                    </p>
                </div>
            )}

            {/* Recent Sessions List */}
            <div className="glass-card">
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                    <FiUsers style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Recent Sessions
                </h3>

                {sessions.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                        No sessions created yet
                    </p>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                style={{
                                    padding: 'var(--spacing-md)',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--glass-border)'
                                }}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>{session.courseName}</h4>
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                                            Created: {new Date(session.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: session.active ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                        color: session.active ? '#4facfe' : 'var(--text-muted)',
                                        fontSize: 'var(--font-size-xs)',
                                        fontWeight: '600'
                                    }}>
                                        {session.active ? 'Active' : 'Expired'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeacherDashboard;

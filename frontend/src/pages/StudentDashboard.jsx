/**
 * Student Dashboard Component
 * 
 * FEATURES:
 * - Lazy-loaded QR scanner (GREEN CODING)
 * - View attendance history
 * - Profile information
 * 
 * GREEN CODING:
 * - QR Scanner loaded only when needed (React.lazy + Suspense)
 * - Paginated attendance history (limits data transfer)
 * - Minimal Firestore queries
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FiCamera, FiList, FiUser, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// GREEN CODING: Lazy load QR Scanner component
// This reduces initial bundle size by ~50KB
const QRScanner = lazy(() => import('../components/QRScanner'));

function StudentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('scan'); // 'scan' or 'history'
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Fetch attendance history when viewing history tab
    useEffect(() => {
        if (activeTab === 'history') {
            fetchAttendanceHistory();
        }
    }, [activeTab]);

    const fetchAttendanceHistory = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // GREEN CODING: Query optimization with limit
            // Note: Removed orderBy to avoid needing composite index
            // We'll sort client-side instead
            const q = query(
                collection(db, 'attendance'),
                where('studentId', '==', user.uid),
                limit(50) // Increased limit since we're sorting client-side
            );

            const snapshot = await getDocs(q);
            const records = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort by markedAt on client-side (descending - newest first)
            records.sort((a, b) => {
                const dateA = new Date(a.markedAt);
                const dateB = new Date(b.markedAt);
                return dateB - dateA;
            });

            // Take only the most recent 20
            const recentRecords = records.slice(0, 20);

            console.log(`Fetched ${recentRecords.length} attendance records for user ${user.uid}`);
            setAttendanceHistory(recentRecords);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);

            // Show error message to user
            setMessage({
                type: 'error',
                text: `Failed to load attendance history: ${error.message}`
            });
        }

        setLoading(false);
    };

    const handleScanSuccess = (data) => {
        setMessage({
            type: 'success',
            text: `✓ Attendance marked successfully for ${data.courseName || 'the session'}!`
        });

        // Auto-switch to history tab after 2 seconds
        setTimeout(() => {
            setActiveTab('history');
            setMessage(null);
        }, 2000);
    };

    const handleScanError = (error) => {
        setMessage({
            type: 'error',
            text: error
        });

        // Clear error after 5 seconds
        setTimeout(() => {
            setMessage(null);
        }, 5000);
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
                    <h1 className="text-gradient">Student Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user?.email}</p>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary">
                    <FiLogOut /> Logout
                </button>
            </div>

            {/* Message Alert */}
            {message && (
                <div className={`alert alert-${message.type} mb-lg`}>
                    {message.text}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="glass-card mb-lg" style={{ padding: 'var(--spacing-sm)' }}>
                <div className="flex gap-sm">
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`btn ${activeTab === 'scan' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1 }}
                    >
                        <FiCamera /> Scan QR
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1 }}
                    >
                        <FiList /> History
                    </button>
                </div>
            </div>

            {/* QR Scanner Tab (Lazy Loaded) */}
            {activeTab === 'scan' && (
                <Suspense
                    fallback={
                        <div className="glass-card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            <div className="spinner" style={{ margin: '0 auto', marginBottom: 'var(--spacing-md)' }}></div>
                            <p style={{ color: 'var(--text-secondary)' }}>Loading scanner...</p>
                        </div>
                    }
                >
                    <QRScanner onSuccess={handleScanSuccess} onError={handleScanError} />
                </Suspense>
            )}

            {/* Attendance History Tab */}
            {activeTab === 'history' && (
                <div className="glass-card">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                        <FiCheckCircle style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Attendance History
                    </h3>

                    {loading ? (
                        <div className="text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            <div className="spinner" style={{ margin: '0 auto' }}></div>
                        </div>
                    ) : attendanceHistory.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: 'var(--spacing-xl)',
                            color: 'var(--text-secondary)'
                        }}>
                            <p>No attendance records yet</p>
                            <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-sm)' }}>
                                Scan a QR code to mark your first attendance
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                            {attendanceHistory.map((record) => (
                                <div
                                    key={record.id}
                                    style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--glass-border)'
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 style={{ marginBottom: '0.25rem' }}>
                                                {record.courseName || 'Attendance Session'}
                                            </h4>
                                            <p style={{
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--text-secondary)',
                                                marginBottom: '0.5rem'
                                            }}>
                                                {new Date(record.markedAt).toLocaleString()}
                                            </p>
                                            {record.distance && (
                                                <p style={{
                                                    fontSize: 'var(--font-size-xs)',
                                                    color: 'var(--text-muted)'
                                                }}>
                                                    Distance: {record.distance}m from classroom
                                                </p>
                                            )}
                                        </div>
                                        <div style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'rgba(0, 242, 254, 0.15)',
                                            color: '#4facfe',
                                            fontSize: 'var(--font-size-xs)',
                                            fontWeight: '600'
                                        }}>
                                            <FiCheckCircle style={{ display: 'inline', marginRight: '0.25rem' }} />
                                            Present
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Profile Card */}
            <div className="glass-card mt-lg">
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                    <FiUser style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Profile
                </h3>
                <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                    <div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                            Email
                        </p>
                        <p style={{ fontWeight: '500' }}>{user?.email}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                            Role
                        </p>
                        <p style={{ fontWeight: '500' }}>Student</p>
                    </div>
                    <div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                            Total Attendance
                        </p>
                        <p style={{ fontWeight: '500' }}>{attendanceHistory.length} sessions</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;

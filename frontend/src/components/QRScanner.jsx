/**
 * QR Scanner Component (LAZY LOADED)
 * 
 * PURPOSE:
 * Scans QR codes and verifies location for attendance marking
 * 
 * GREEN CODING OPTIMIZATIONS:
 * 1. Lazy loaded using React.lazy() - only loaded when needed
 * 2. GPS fetched ONCE on component mount (not continuously)
 * 3. Camera stream stopped after successful scan (saves battery)
 * 4. Single API call to backend for verification
 * 
 * VIVA EXPLANATION:
 * This component uses the html5-qrcode library to scan QR codes.
 * When mounted, it fetches the user's GPS coordinates once and caches them.
 * After scanning, it sends the QR data + location to the backend for verification.
 * The lazy loading ensures this component only loads when students need to scan,
 * reducing the initial bundle size significantly.
 */

import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../contexts/AuthContext';
import { FiMapPin, FiCheckCircle, FiXCircle } from 'react-icons/fi';

function QRScanner({ onSuccess, onError }) {
    const { user } = useAuth();
    const [scanning, setScanning] = useState(true);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const scannerRef = useRef(null);
    const scannerInitialized = useRef(false);

    /**
     * GREEN CODING: Fetch GPS coordinates ONCE when component mounts
     * Not continuously polling - single fetch saves battery and processing
     */
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                    console.log('Location acquired:', position.coords);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLocationError('Unable to get your location. Please enable location services.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            setLocationError('Geolocation is not supported by your browser');
        }

        // Cleanup: Stop scanner when component unmounts
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, []);

    /**
     * Initialize QR Scanner after location is acquired
     */
    useEffect(() => {
        if (location && !scannerInitialized.current) {
            initializeScanner();
            scannerInitialized.current = true;
        }
    }, [location]);

    const initializeScanner = () => {
        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10, // Frames per second for scanning
                qrbox: { width: 250, height: 250 }, // Scanning box size
                aspectRatio: 1.0
            },
            false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;
    };

    const onScanSuccess = async (decodedText, decodedResult) => {
        console.log('QR Code scanned:', decodedText);
        setScanning(false);

        // Stop the scanner after successful scan (GREEN CODING: saves resources)
        if (scannerRef.current) {
            await scannerRef.current.clear();
        }

        // Send attendance data to backend for verification
        try {
            const response = await fetch('http://localhost:3000/api/attendance/mark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: decodedText,
                    studentId: user.uid,
                    studentEmail: user.email,
                    location: {
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                onSuccess && onSuccess(data);
            } else {
                // Enhanced error message with debug info
                let errorMsg = data.message || 'Failed to mark attendance';
                if (data.debug) {
                    errorMsg += `\n\nDebug Info:\nYour location: ${data.debug.yourLocation}\nClassroom: ${data.debug.classLocation}\nDistance: ${data.debug.distance}m (need: ${data.debug.required}m)`;
                }
                onError && onError(errorMsg);
                // Restart scanner for retry
                setScanning(true);
                setTimeout(() => {
                    initializeScanner();
                }, 2000);
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            onError && onError('Network error. Please try again.');
            setScanning(true);
            setTimeout(() => {
                initializeScanner();
            }, 2000);
        }
    };

    const onScanFailure = (error) => {
        // This is called frequently during scanning, so we don't log it
        // Only actual scan failures are important
    };

    return (
        <div className="glass-card">
            <h3 style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
                Scan QR Code
            </h3>

            {/* Location Status */}
            <div style={{
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--spacing-md)',
                background: location ? 'rgba(0, 242, 254, 0.1)' : 'rgba(245, 87, 108, 0.1)',
                border: `1px solid ${location ? 'rgba(0, 242, 254, 0.3)' : 'rgba(245, 87, 108, 0.3)'}`
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: location ? '0.5rem' : '0' }}>
                    <FiMapPin />
                    {location ? (
                        <span style={{ fontSize: 'var(--font-size-sm)', color: '#4facfe' }}>
                            Location acquired ✓
                        </span>
                    ) : locationError ? (
                        <span style={{ fontSize: 'var(--font-size-sm)', color: '#ff6b8a' }}>
                            {locationError}
                        </span>
                    ) : (
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                            Getting your location...
                        </span>
                    )}
                </div>
                {/* Display coordinates for debugging */}
                {location && (
                    <div style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-muted)',
                        fontFamily: 'monospace',
                        marginTop: '0.25rem'
                    }}>
                        Your location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        {location.accuracy && ` (±${Math.round(location.accuracy)}m)`}
                    </div>
                )}
            </div>

            {/* QR Scanner Element */}
            {location && scanning && (
                <div id="qr-reader" style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                }}></div>
            )}

            {/* Instructions */}
            <div style={{
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)',
                textAlign: 'center'
            }}>
                {scanning ? (
                    'Position the QR code within the frame to scan'
                ) : (
                    'Processing attendance...'
                )}
            </div>
        </div>
    );
}

export default QRScanner;

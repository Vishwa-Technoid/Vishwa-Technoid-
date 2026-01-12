/**
 * Login Page Component
 * 
 * FEATURES:
 * - Email/password authentication
 * - Form validation
 * - Beautiful glassmorphic design
 * - Responsive layout
 * 
 * GREEN CODING:
 * - Minimal re-renders using controlled inputs
 * - No unnecessary API calls
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            // Navigate to dashboard (role-based routing handled by App.jsx)
            navigate('/dashboard');
        } else {
            setError(result.error || 'Failed to login');
        }
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="glass-card" style={{ maxWidth: '450px', width: '100%' }}>
                {/* Header */}
                <div className="text-center mb-lg">
                    <h1 className="text-gradient" style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Login to mark your attendance</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="input-group">
                        <label className="input-label">
                            <FiMail style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="input-group">
                        <label className="input-label">
                            <FiLock style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                        ) : (
                            <>
                                <FiLogIn />
                                Login
                            </>
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-md">
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;

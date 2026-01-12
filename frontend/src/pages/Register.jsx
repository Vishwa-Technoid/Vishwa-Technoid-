/**
 * Registration Page Component
 * 
 * FEATURES:
 * - User registration with role selection (Teacher/Student)
 * - Form validation
 * - Beautiful glassmorphic design
 * 
 * GREEN CODING:
 * - Efficient form state management
 * - Single Firebase call for registration
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student' // Default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await register(formData.email, formData.password, formData.name, formData.role);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Failed to register');
        }
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
                {/* Header */}
                <div className="text-center mb-lg">
                    <h1 className="text-gradient" style={{ marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Join our smart attendance system</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                    {/* Name Input */}
                    <div className="input-group">
                        <label className="input-label">
                            <FiUser style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="input-field"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="input-group">
                        <label className="input-label">
                            <FiMail style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="input-group">
                        <label className="input-label">
                            Select Role
                        </label>
                        <select
                            name="role"
                            className="select-field"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    {/* Password Input */}
                    <div className="input-group">
                        <label className="input-label">
                            <FiLock style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                            placeholder="Minimum 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="input-group">
                        <label className="input-label">
                            <FiLock style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="input-field"
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                                <FiUserPlus />
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-md">
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../api/authService';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'buyer'
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { email, password } = formData;

        // Email: must contain at least one lowercase letter and @
        const emailRegex = /^(?=.*[a-z]).*@.*$/;
        if (!emailRegex.test(email)) {
            setError('Email must contain lowercase letters and an @ symbol');
            return false;
        }

        // Password: 8-15 chars, special char, capital, small, number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be 8-15 characters and include uppercase, lowercase, number, and special character (@$!%*?&)');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;
        try {
            // Step 1: Register
            await authService.register({
                ...formData,
                role: formData.role.toUpperCase() // Backend expects BUYER, OWNER
            });

            // Step 2: Redirect to login page
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-wrapper">
            {/* Left Side - Image */}
            <div className="auth-image-side">
                <div className="auth-image-overlay"></div>
                <div className="auth-image-gradient"></div>
                <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"
                    alt="Premium Real Estate"
                    className="auth-image"
                />
                <div className="auth-image-content">
                    <Link to="/" className="auth-logo-large">
                        Land<span>Market</span>
                    </Link>
                    <h2 className="auth-image-title">Institutional<br />Grade Land<br />Exchange.</h2>
                    <p className="auth-image-desc">Join the definitive marketplace for high-yield acreage. Access verified listings and secure premium assets with surgical accuracy.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="auth-form-side">
                {/* Mobile Logo */}
                <Link to="/" className="auth-mobile-logo">
                    Land<span>Market</span>
                </Link>

                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Your journey starts here.</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-input-group">
                            <label className="auth-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Work Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••••••"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Default Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="auth-input auth-select"
                            >
                                <option value="buyer">Buyer (Investment Focus)</option>
                                <option value="owner">Owner (Asset Liquidation)</option>
                            </select>
                        </div>

                        <button type="submit" className="auth-submit-btn">
                            Initialize Account
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Already have an account? <Link to="/login">Sign in instead</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

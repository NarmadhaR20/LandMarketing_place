import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const successMsg = location.state?.message;
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            navigate(`/${user.role}`);
        } catch (err) {
            console.error('Login error details:', err.response?.data);
            const backendMsg = err.response?.data?.message || 'Invalid email or password';
            setError(backendMsg);
        }
    };

    return (
        <div className="auth-wrapper">
            {/* Left Side - Image */}
            <div className="auth-image-side">
                <div className="auth-image-overlay"></div>
                <div className="auth-image-gradient"></div>
                <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
                    alt="Agricultural Land"
                    className="auth-image"
                />
                <div className="auth-image-content">
                    <Link to="/" className="auth-logo-large">
                        Land<span>Market</span>
                    </Link>
                    <h2 className="auth-image-title">Welcome<br />Back to the<br />Exchange.</h2>
                    <p className="auth-image-desc">Manage your portfolio, explore new high-yield acreage, and execute verified transactions seamlessly.</p>
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
                        <h1 className="auth-title">Sign In</h1>
                        <p className="auth-subtitle">Access your dashboard.</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}
                    {successMsg && <div className="auth-success">{successMsg}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-input-group">
                            <label className="auth-label">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                Password
                                <Link to="/forgot-password" className="text-primary hover:text-white transition-colors" style={{ fontSize: '0.7rem' }}>Forgot?</Link>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                            />
                        </div>

                        <button type="submit" className="auth-submit-btn">
                            Sign In to Portal
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Don't have an account? <Link to="/register">Create one now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

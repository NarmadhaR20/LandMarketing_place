import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await API.post('/users/forgot-password', { email });
            setMessage(res.data); // Display success message from backend
        } catch (err) {
            setError(err.response?.data?.message || 'Error processing request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-form-side" style={{ width: '100%', maxWidth: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Link to="/" className="auth-mobile-logo" style={{ display: 'block', marginBottom: '2rem' }}>
                    Land<span>Market</span>
                </Link>

                <div className="auth-form-container" style={{ maxWidth: '400px', width: '100%', margin: '0 auto', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="auth-header text-center mb-8">
                        <h1 className="text-2xl font-black text-white mb-2">Reset Password</h1>
                        <p className="text-muted text-sm">Enter your email to receive a reset token</p>
                    </div>

                    {error && <div className="auth-error mb-4">{error}</div>}
                    {message && <div className="auth-success mb-4 text-success bg-success/10 p-3 rounded-lg text-sm text-center border border-success/20">{message}</div>}

                    <form onSubmit={handleSubmit} className="auth-form space-y-4">
                        <div className="auth-input-group">
                            <label className="auth-label block mb-2 text-xs font-bold uppercase tracking-widest text-muted">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary/50 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-submit-btn w-full bg-primary text-white font-black uppercase tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4 block"
                        >
                            {loading ? 'Sending Request...' : 'Send Reset Token'}
                        </button>
                    </form>

                    <p className="auth-footer-text text-center mt-6 text-sm text-muted">
                        Remembered your password? <Link to="/login" className="text-primary hover:text-white transition-colors">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

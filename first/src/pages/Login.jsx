import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_URL } from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.token);
                navigate('/');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <>
            <Navbar />
            <div className="hero-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div className="hero-bg-glow"></div>
                <div className="container flex justify-center items-center" style={{ flex: 1 }}>
                    <div className="modal-content" style={{ maxWidth: '400px', width: '100%', margin: '0 auto', animation: 'slideIn 0.3s ease-out' }}>
                        <h2 className="text-xl font-bold mb-6 text-center">Welcome Back</h2>

                        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-full mb-4">
                                Sign In
                            </button>

                            <p className="text-center text-muted text-sm">
                                Don't have an account? <Link to="/signup" className="text-secondary">Sign Up</Link>
                            </p>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_URL } from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginRole, setLoginRole] = useState('user');
    const [adminPasskey, setAdminPasskey] = useState('');
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
                body: JSON.stringify({ email, password, loginRole, adminPasskey }),
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
                            <div className="form-group flex justify-center gap-6 mb-6">
                                <label className="flex items-center gap-2 cursor-pointer text-muted hover:text-white transition-colors" style={{fontWeight: loginRole==='user'?'bold':'normal', color: loginRole==='user'?'white':'inherit'}}>
                                    <input 
                                        type="radio" 
                                        className="accent-purple-500"
                                        checked={loginRole === 'user'} 
                                        onChange={() => setLoginRole('user')} 
                                    />
                                    Login as User
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-muted hover:text-white transition-colors" style={{fontWeight: loginRole==='admin'?'bold':'normal', color: loginRole==='admin'?'var(--color-warning)':'inherit'}}>
                                    <input 
                                        type="radio" 
                                        className="accent-yellow-500"
                                        checked={loginRole === 'admin'} 
                                        onChange={() => setLoginRole('admin')} 
                                    />
                                    Login as Admin
                                </label>
                            </div>

                            {loginRole === 'admin' && (
                                <div className="form-group mb-6" style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                    <label style={{ color: 'var(--color-warning)' }}>Admin Secret Passkey</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={adminPasskey}
                                        onChange={(e) => setAdminPasskey(e.target.value)}
                                        required={loginRole === 'admin'}
                                        placeholder="Enter the master passkey"
                                        style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '0.5rem', opacity: 0.8 }}>Required to gain Add Event privileges.</p>
                                </div>
                            )}

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

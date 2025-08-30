// frontend/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            onLogin(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login to Notsa</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p onClick={onSwitchToRegister} className="switch-auth-link">
                Don't have an account? Register
            </p>
        </div>
    );
}
export default Login;
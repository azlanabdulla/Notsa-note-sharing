// frontend/src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegister, onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
            onRegister(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={e => setPassword(e.target.value)} required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p onClick={onSwitchToLogin} className="switch-auth-link">
                Already have an account? Login
            </p>
        </div>
    );
}
export default Register;
// frontend/src/components/Navbar.js
import React from 'react';

function Navbar({ user, onLogout }) {
    return (
        <header className="navbar">
            <div className="navbar-brand">Notsa 📚</div>
            {user && (
                <div className="navbar-user">
                    <span>Welcome, {user.username}</span>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            )}
        </header>
    );
}
export default Navbar;
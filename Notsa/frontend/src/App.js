import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SubjectList from './components/SubjectList';
import NoteList from './components/NoteList';
import PDFViewer from './components/PDFViewer';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';

function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('login');
    const [currentSubject, setCurrentSubject] = useState(null);
    const [currentNote, setCurrentNote] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('notsa-user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            axios.defaults.headers.common['x-auth-token'] = userData.token;
            setView('subjects');
        }
        setIsAuthenticating(false);
    }, []);

    const handleLogin = (userData) => {
        localStorage.setItem('notsa-user', JSON.stringify(userData));
        axios.defaults.headers.common['x-auth-token'] = userData.token;
        setUser(userData);
        setView('subjects');
    };

    const handleLogout = () => {
        localStorage.removeItem('notsa-user');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
        setView('login');
    };

    const handleSubjectClick = (subject) => {
        setCurrentSubject(subject);
        setView('notes');
    };

    const handleNoteClick = (note) => {
        setCurrentNote(note);
        setView('pdf');
    };

    const handleBack = () => {
        if (view === 'pdf') {
            setView('notes');
            setCurrentNote(null);
        } else if (view === 'notes') {
            setView('subjects');
            setCurrentSubject(null);
        }
    };

    if (isAuthenticating) return <div className="loading">Loading Application...</div>;

    if (!user) {
        return (
            <div className="app-container">
                {view === 'login' ? <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} /> : <Register onRegister={handleLogin} onSwitchToLogin={() => setView('login')} />}
            </div>
        );
    }

    return (
        <div className="app-container">
            <Navbar user={user} onLogout={handleLogout} />
            <main className="app-main">
                {view === 'subjects' && <SubjectList user={user} onSubjectClick={handleSubjectClick} />}
                {view === 'notes' && currentSubject && <NoteList subject={currentSubject} user={user} onNoteClick={handleNoteClick} onBackClick={handleBack} />}
                {view === 'pdf' && currentNote && <PDFViewer note={currentNote} onBackClick={handleBack} />}
            </main>
        </div>
    );
}

export default App;
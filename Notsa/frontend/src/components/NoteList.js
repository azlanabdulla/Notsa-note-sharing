import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import UploadModal from './UploadModal';
import ConfirmationModal from './ConfirmationModal';

function NoteList({ subject, user, onNoteClick, onBackClick }) {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [noteToDelete, setNoteToDelete] = useState(null);

    const fetchNotes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // *** CRITICAL FIX: Explicitly send the token in the headers ***
            const res = await axios.get(`http://localhost:5000/api/notes/${subject._id}`, {
                headers: { 'x-auth-token': user.token }
            });
            setNotes(res.data);
        } catch (err) {
            console.error("Failed to fetch notes", err);
            setError('Could not load notes. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [subject._id, user.token]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleUploadSuccess = (newNote) => {
        setNotes([newNote, ...notes]);
        setIsModalOpen(false);
    };

    const handleDeleteNote = async () => {
        if (!noteToDelete) return;
        try {
            await axios.delete(`http://localhost:5000/api/notes/${noteToDelete._id}`, {
                headers: { 'x-auth-token': user.token }
            });
            setNotes(notes.filter(n => n._id !== noteToDelete._id));
        } catch (err) {
            setError('Could not delete note.');
        }
    };

    if (isLoading) return <div className="loading">Loading notes...</div>;

    return (
        <div className="view-container">
            <div className="view-header">
                <button onClick={onBackClick} className="back-button">← Back to Subjects</button>
                <h2>Notes for: {subject.name}</h2>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="list-container">
                {notes.map((note) => (
                    <div key={note._id} className="file-item">
                        <div className="item-content" onClick={() => onNoteClick(note)}>
                            <div className="file-icon">📄</div>
                            <div className="file-name">{note.title}</div>
                        </div>
                        <button onClick={() => setNoteToDelete(note)} className="delete-btn">🗑️</button>
                    </div>
                ))}
                {notes.length === 0 && <p className="empty-message">No notes found. Be the first to upload!</p>}
            </div>
            <button onClick={() => setIsModalOpen(true)} className="upload-button">+ Add New Note</button>
            {isModalOpen && <UploadModal subject={subject} user={user} onClose={() => setIsModalOpen(false)} onUploadSuccess={handleUploadSuccess} />}
            {noteToDelete && <ConfirmationModal itemType="note" itemName={noteToDelete.title} onConfirm={handleDeleteNote} onClose={() => setNoteToDelete(null)} />}
        </div>
    );
}

export default NoteList;
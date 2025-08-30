import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';

function SubjectList({ user, onSubjectClick }) {
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                // *** CRITICAL FIX: Explicitly send the token in the headers ***
                const response = await axios.get('http://localhost:5000/api/subjects', {
                    headers: { 'x-auth-token': user.token }
                });
                setSubjects(response.data);
            } catch (err) {
                setError('Failed to load subjects. Please try refreshing.');
                console.error("Subject fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubjects();
    }, [user.token]);

    const handleCreateSubject = async (e) => {
        e.preventDefault();
        if (!newSubjectName.trim()) return;
        setIsSubmitting(true);
        try {
            const response = await axios.post(
                'http://localhost:5000/api/subjects',
                { name: newSubjectName },
                { headers: { 'x-auth-token': user.token } }
            );
            setSubjects([...subjects, response.data]);
            setNewSubjectName('');
            setIsCreating(false);
        } catch (err) {
            setError('Could not create subject.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSubject = async () => {
        if (!subjectToDelete) return;
        try {
            await axios.delete(`http://localhost:5000/api/subjects/${subjectToDelete._id}`, {
                headers: { 'x-auth-token': user.token }
            });
            setSubjects(subjects.filter(s => s._id !== subjectToDelete._id));
        } catch (err) {
            setError('Could not delete subject.');
        }
    };

    if (isLoading) return <div className="loading">Loading subjects...</div>;

    return (
        <div className="view-container">
            <div className="view-header">
                <h2>All Subjects</h2>
                {!isCreating && <button onClick={() => setIsCreating(true)} className="create-subject-btn">+ Add Subject</button>}
            </div>
            {isCreating && (
                <form onSubmit={handleCreateSubject} className="create-subject-form">
                    <input type="text" placeholder="Enter new subject name..." value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} autoFocus />
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create'}</button>
                    <button type="button" onClick={() => setIsCreating(false)} disabled={isSubmitting}>Cancel</button>
                </form>
            )}
            {error && <p className="error-message">{error}</p>}
            <div className="grid-container">
                {subjects.map((subject) => (
                    <div key={subject._id} className="folder-item">
                        <div className="item-content" onClick={() => onSubjectClick(subject)}>
                            <div className="folder-icon">📁</div>
                            <div className="folder-name">{subject.name}</div>
                        </div>
                        <button onClick={() => setSubjectToDelete(subject)} className="delete-btn">🗑️</button>
                    </div>
                ))}
            </div>
            {subjects.length === 0 && !isCreating && <p className="empty-message">No subjects found. Click "Add Subject" to create one!</p>}
            {subjectToDelete && <ConfirmationModal itemType="subject" itemName={subjectToDelete.name} onConfirm={handleDeleteSubject} onClose={() => setSubjectToDelete(null)} />}
        </div>
    );
}

export default SubjectList;
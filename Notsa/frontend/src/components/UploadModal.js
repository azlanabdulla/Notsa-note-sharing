import React, { useState } from 'react';
import axios from 'axios';

function UploadModal({ subject, user, onClose, onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            setError('Please provide a title and select a file.');
            return;
        }
        setError('');
        setSuccessMessage('');
        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('noteFile', file);
        formData.append('subjectId', subject._id);

        try {
            const response = await axios.post('http://localhost:5000/api/notes/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': user.token,
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            setSuccessMessage('File uploaded successfully!');
            setTimeout(() => {
                onUploadSuccess(response.data);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.msg || 'Upload failed. Please try again.');
            setIsUploading(false);
        }
    };
    
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Upload Note to "{subject.name}"</h2>
                {successMessage ? (
                    <div className="success-message">{successMessage}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Note Title (e.g., Module 1)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isUploading}
                            required
                        />
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            disabled={isUploading}
                            required
                        />
                        {isUploading && (
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}>
                                    {uploadProgress}%
                                </div>
                            </div>
                        )}
                        {error && <p className="error-message">{error}</p>}
                        <div className="modal-actions">
                            <button type="button" onClick={onClose} disabled={isUploading} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={isUploading} className="btn-primary">
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default UploadModal;
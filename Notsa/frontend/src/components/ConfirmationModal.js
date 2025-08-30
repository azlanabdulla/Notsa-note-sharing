import React, { useState } from 'react';

function ConfirmationModal({ itemType, itemName, onConfirm, onClose }) {
    const [inputValue, setInputValue] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const isMatch = inputValue === itemName;

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error("Deletion failed", error);
        }
        setIsDeleting(false);
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content confirmation-modal">
                <h2>Delete {itemType}</h2>
                <p>
                    This action is permanent and cannot be undone.
                    {itemType === 'subject' && ' This will also delete all notes within this subject.'}
                </p>
                <p>
                    Please type <strong>{itemName}</strong> to confirm.
                </p>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Type "${itemName}"`}
                    autoFocus
                />
                <div className="modal-actions">
                    <button onClick={onClose} disabled={isDeleting} className="btn-secondary">Cancel</button>
                    <button
                        onClick={handleConfirm}
                        disabled={!isMatch || isDeleting}
                        className="btn-danger"
                    >
                        {isDeleting ? 'Deleting...' : `Delete this ${itemType}`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
import React, { useState } from 'react';

const RatingModal = ({ isOpen, onClose, onSubmit, lessonId, skillName }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onSubmit(lessonId, rating, feedback);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>Rate Your Lesson</h2>
          <button className="close-button" onClick={onClose} disabled={submitting}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p>How would you rate your lesson on <strong>{skillName}</strong>?</p>
          
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          
          <div className="form-group">
            <label htmlFor="feedback">Feedback (optional):</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with this lesson..."
              rows="4"
              disabled={submitting}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal-footer">
          <button 
            className="secondary-button" 
            onClick={onClose} 
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            className="primary-button" 
            onClick={handleSubmit} 
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s;
        }

        .modal-content {
          background: #252525;
          border-radius: 8px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
          width: 90%;
          max-width: 500px;
          animation: slideIn 0.3s;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-header h2 {
          margin: 0;
          color: #fff;
          font-size: 1.5rem;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #aaa;
        }

        .close-button:hover {
          color: #fff;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-footer {
          padding: 15px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid #333;
        }

        .rating-stars {
          display: flex;
          justify-content: center;
          margin: 20px 0;
          gap: 10px;
        }

        .star {
          font-size: 32px;
          color: #555;
          cursor: pointer;
          transition: color 0.2s;
        }

        .star:hover, .star.filled {
          color: var(--primary);
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #ccc;
        }

        textarea {
          width: 100%;
          padding: 10px;
          border-radius: 4px;
          background: #333;
          border: 1px solid #444;
          color: #fff;
          resize: vertical;
        }

        textarea:focus {
          outline: none;
          border-color: var(--primary);
        }

        .error-message {
          color: #ff6b6b;
          margin-top: 10px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RatingModal;

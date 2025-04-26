import React from 'react';

const SkillProofs = ({ proofs, onDelete }) => {
  if (!proofs || proofs.length === 0) {
    return (
      <div className="skill-proofs-container empty">
        <p>No skill proofs uploaded yet.</p>
      </div>
    );
  }

  // Sort proofs by upload date (newest first)
  const sortedProofs = [...proofs].sort((a, b) => {
    return new Date(b.uploadedAt) - new Date(a.uploadedAt);
  });

  return (
    <div className="skill-proofs-container">
      <div className="proofs-list">
        {sortedProofs.map((proof) => (
          <div key={proof.id} className="proof-item">
            <div className="proof-header">
              <div className="proof-skill">{proof.skillName}</div>
              <div className="proof-date">{new Date(proof.uploadedAt).toLocaleDateString()}</div>
            </div>
            
            <div className="proof-content">
              {proof.fileType.startsWith('image/') ? (
                <div className="proof-image-container">
                  <img src={proof.fileURL} alt={`Proof for ${proof.skillName}`} className="proof-image" />
                </div>
              ) : (
                <div className="proof-pdf-container">
                  <a href={proof.fileURL} target="_blank" rel="noopener noreferrer" className="proof-pdf-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    View PDF Document
                  </a>
                </div>
              )}
            </div>
            
            {onDelete && (
              <div className="proof-actions">
                <button 
                  className="delete-proof-button" 
                  onClick={() => onDelete(proof.id)}
                >
                  Delete Proof
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx="true">{`
        .skill-proofs-container {
          background: #252525;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }

        .skill-proofs-container.empty {
          display: flex;
          justify-content: center;
          min-height: 100px;
          align-items: center;
          color: #999;
        }

        .proofs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .proof-item {
          padding: 15px;
          background: #333;
          border-radius: 6px;
        }

        .proof-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .proof-skill {
          font-weight: 500;
          color: #fff;
        }

        .proof-date {
          color: #999;
          font-size: 14px;
        }

        .proof-content {
          margin: 15px 0;
        }

        .proof-image-container {
          display: flex;
          justify-content: center;
          background: #222;
          border-radius: 4px;
          overflow: hidden;
        }

        .proof-image {
          max-width: 100%;
          max-height: 300px;
          object-fit: contain;
        }

        .proof-pdf-container {
          display: flex;
          justify-content: center;
        }

        .proof-pdf-link {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #444;
          color: white;
          padding: 10px 15px;
          border-radius: 4px;
          text-decoration: none;
          transition: background 0.2s;
        }

        .proof-pdf-link:hover {
          background: var(--primary);
        }

        .proof-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .delete-proof-button {
          background: #444;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .delete-proof-button:hover {
          background: #d32f2f;
        }
      `}</style>
    </div>
  );
};

export default SkillProofs;

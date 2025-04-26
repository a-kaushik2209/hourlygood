import React, { useState } from 'react';

const SkillProofUpload = ({ onUpload, skillName }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }
    
    // Check file type
    if (selectedFile.type !== 'application/pdf' && 
        !selectedFile.type.startsWith('image/jpeg') && 
        !selectedFile.type.startsWith('image/jpg')) {
      setError('Only PDF and JPG files are allowed');
      setFile(null);
      setPreview(null);
      return;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setError('File size must be less than 5MB');
      setFile(null);
      setPreview(null);
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview for image files
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      await onUpload(file, skillName);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="skill-proof-upload">
      <div className="upload-header">
        <h3>Upload Proof for {skillName}</h3>
        <p className="upload-info">Upload a PDF or JPG file (max 5MB) as proof of your skill</p>
      </div>
      
      <div className="file-input-container">
        <input 
          type="file" 
          id="proof-file" 
          accept=".pdf,.jpg,.jpeg" 
          onChange={handleFileChange} 
          disabled={uploading}
        />
        <label htmlFor="proof-file" className={uploading ? 'disabled' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          {file ? file.name : 'Choose a file'}
        </label>
      </div>
      
      {preview && (
        <div className="file-preview">
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}
      
      {file && !preview && (
        <div className="file-preview pdf">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <div className="pdf-name">{file.name}</div>
        </div>
      )}
      
      {error && <div className="upload-error">{error}</div>}
      
      <div className="upload-actions">
        <button 
          className="upload-button" 
          onClick={handleUpload} 
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Proof'}
        </button>
      </div>

      <style jsx="true">{`
        .skill-proof-upload {
          background: #252525;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        
        .upload-header {
          margin-bottom: 20px;
        }
        
        .upload-header h3 {
          margin: 0 0 5px 0;
          color: #fff;
        }
        
        .upload-info {
          margin: 0;
          color: #999;
          font-size: 14px;
        }
        
        .file-input-container {
          margin-bottom: 20px;
        }
        
        .file-input-container input {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }
        
        .file-input-container label {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #333;
          color: white;
          padding: 12px 15px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .file-input-container label:hover {
          background: #444;
        }
        
        .file-input-container label.disabled {
          background: #333;
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .file-preview {
          margin-bottom: 20px;
          background: #333;
          border-radius: 4px;
          padding: 10px;
          display: flex;
          justify-content: center;
        }
        
        .preview-image {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
        }
        
        .file-preview.pdf {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        
        .pdf-name {
          margin-top: 10px;
          color: #ccc;
          text-align: center;
          word-break: break-all;
        }
        
        .upload-error {
          color: #ff6b6b;
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(255, 107, 107, 0.1);
          border-radius: 4px;
        }
        
        .upload-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .upload-button {
          background: var(--primary);
          color: black;
          font-weight: 500;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        
        .upload-button:hover {
          background: #ffb74d;
        }
        
        .upload-button:active {
          transform: translateY(1px);
        }
        
        .upload-button:disabled {
          background: #555;
          color: #999;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SkillProofUpload;

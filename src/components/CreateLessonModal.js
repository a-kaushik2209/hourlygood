import React, { useState, useEffect } from 'react';
import { useLesson } from '../contexts/LessonContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

function CreateLessonModal({ onClose, skillId, skillName, teacherId, teacherName }) {
  const { scheduleLesson } = useLesson();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    notes: ''
  });

  // Set minimum date to today
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: formattedDate }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form data
      if (!formData.date || !formData.time) {
        throw new Error('Please select a date and time for the lesson');
      }
      
      // Create lesson data
      const lessonData = {
        skillId,
        skillName,
        teacherId,
        teacherName,
        location: formData.location,
        notes: formData.notes,
        date: formData.date,
        time: formData.time
      };
      
      // Schedule the lesson
      await scheduleLesson(lessonData);
      setSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#1e1e1e',
        borderRadius: '8px',
        padding: '25px',
        width: '90%',
        maxWidth: '500px'
      }}>
        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Lesson Scheduled!</h3>
            <p style={{ color: '#aaa' }}>Your lesson has been scheduled successfully.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary)', margin: 0 }}>Schedule Lesson</h3>
              <button 
                onClick={onClose}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#aaa', 
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#ddd', marginBottom: '5px' }}>Skill</div>
              <div style={{ 
                background: '#252525', 
                padding: '10px 15px', 
                borderRadius: '5px', 
                color: 'var(--primary)',
                fontWeight: '500'
              }}>
                {skillName}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#ddd', marginBottom: '5px' }}>Teacher</div>
              <div style={{ 
                background: '#252525', 
                padding: '10px 15px', 
                borderRadius: '5px', 
                color: '#ddd'
              }}>
                {teacherName}
              </div>
            </div>
            
            {error && (
              <div style={{ 
                background: 'rgba(244, 67, 54, 0.1)', 
                color: '#f44336', 
                padding: '10px 15px',
                borderRadius: '5px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#ddd', marginBottom: '5px' }}>
                  Date *
                </label>
                <input 
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    background: '#252525',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    padding: '10px',
                    color: '#ddd'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#ddd', marginBottom: '5px' }}>
                  Time *
                </label>
                <input 
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    background: '#252525',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    padding: '10px',
                    color: '#ddd'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#ddd', marginBottom: '5px' }}>
                  Location (optional)
                </label>
                <input 
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Zoom, Google Meet, Coffee Shop"
                  style={{
                    width: '100%',
                    background: '#252525',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    padding: '10px',
                    color: '#ddd'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#ddd', marginBottom: '5px' }}>
                  Notes (optional)
                </label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information for the teacher..."
                  style={{
                    width: '100%',
                    background: '#252525',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    padding: '10px',
                    color: '#ddd',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={onClose}
                  style={{ 
                    background: '#333', 
                    color: '#ddd',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  style={{ 
                    background: 'var(--primary)', 
                    color: 'black',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    fontWeight: '500'
                  }}
                >
                  {loading ? 'Scheduling...' : 'Schedule Lesson'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateLessonModal;
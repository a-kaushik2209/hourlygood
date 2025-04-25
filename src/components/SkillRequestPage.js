import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSkill } from '../contexts/SkillContext';

function SkillRequestPage({ setPage }) {
  const { currentUser } = useAuth();
  const { createSkillRequest } = useSkill();
  const [formData, setFormData] = useState({
    skillName: '',
    skillDescription: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: '',
    location: 'online',
    category: 'technology'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a request');
      return;
    }
    
    // Validate form
    if (!formData.skillName.trim()) {
      setError('Skill name is required');
      return;
    }
    
    if (!formData.skillDescription.trim()) {
      setError('Skill description is required');
      return;
    }
    
    if (!formData.preferredDate) {
      setError('Preferred date is required');
      return;
    }
    
    if (!formData.preferredTime) {
      setError('Preferred time is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create the skill request in Firebase
      await createSkillRequest(formData);
      setSubmitted(true);
      
      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        setSubmitted(false);
        setPage('marketplace');
      }, 3000);
    } catch (err) {
      setError('Failed to create request: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '1rem auto' }}>
      <div className="card" style={{ padding: '30px', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Request a Skill Lesson</h2>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>
          Fill out this form to request a 1-hour lesson from someone with the skill you want to learn. 
          This will cost 1 time credit once the lesson is completed. Your request will be visible in the marketplace for potential tutors.
        </p>

        {submitted ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px', 
            background: '#252525', 
            borderRadius: '8px',
            animation: 'fadeIn 0.5s'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Request Submitted!</h3>
            <p style={{ color: '#ddd', marginBottom: '20px' }}>
              Your skill lesson request has been submitted and is now visible in the marketplace. You'll be notified when someone accepts your request.
            </p>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Redirecting to the Skill Marketplace...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ddd' }}>
                Skill You Want to Learn*
              </label>
              <input 
                type="text" 
                name="skillName"
                value={formData.skillName}
                onChange={handleChange}
                placeholder="e.g., Tabla, Indian Cooking, JavaScript, Photography"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ddd' }}>
                Describe What You Want to Learn*
              </label>
              <textarea 
                name="skillDescription"
                value={formData.skillDescription}
                onChange={handleChange}
                placeholder="Describe what specific aspects of this skill you want to learn in this 1-hour lesson"
                required
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ddd' }}>
                  Preferred Date
                </label>
                <input 
                  type="date" 
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ddd' }}>
                  Preferred Time
                </label>
                <input 
                  type="time" 
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ddd' }}>
                Location Preference
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
              >
                <option value="online">Online (Video Call)</option>
                <option value="in-person">In-Person</option>
                <option value="flexible">Flexible (Either)</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ddd' }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff' }}
              >
                <option value="technology">Technology</option>
                <option value="music">Music & Dance</option>
                <option value="cooking">Cooking</option>
                <option value="art">Art & Design</option>
                <option value="fitness">Yoga & Fitness</option>
                <option value="professional">Professional Skills</option>
                <option value="language">Languages</option>
                <option value="academic">Academic Subjects</option>
              </select>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ddd' }}>
                Additional Notes
              </label>
              <textarea 
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any additional information that might help potential teachers (your current skill level, specific goals, etc.)"
                rows={3}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#252525', border: '1px solid #333', color: '#fff', resize: 'vertical' }}
              />
            </div>

            {error && (
              <div style={{ 
                background: '#ff5252', 
                color: 'white', 
                padding: '10px 15px', 
                borderRadius: '8px', 
                marginBottom: '20px' 
              }}>
                {error}
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                background: '#252525',
                padding: '10px 15px',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'black',
                  fontWeight: 'bold'
                }}>
                  1
                </div>
                <div style={{ color: '#fff', fontWeight: '500' }}>
                  Time Credit
                </div>
              </div>

              <div>
                <button 
                  type="button" 
                  onClick={() => setPage('marketplace')}
                  disabled={loading}
                  style={{ 
                    background: '#333', 
                    color: '#ddd', 
                    border: 'none', 
                    padding: '12px 20px', 
                    borderRadius: '8px', 
                    marginRight: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  style={{ 
                    background: loading ? '#555' : 'var(--primary)', 
                    color: 'black', 
                    border: 'none', 
                    padding: '12px 20px', 
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '1.2rem' }}>How Skill Requests Work</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ 
              minWidth: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              color: 'black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>1</div>
            <div>
              <div style={{ fontWeight: '500', color: '#ddd' }}>Submit Your Request</div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>Describe the skill you want to learn and your preferred time for a 1-hour lesson.</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ 
              minWidth: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              color: 'black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>2</div>
            <div>
              <div style={{ fontWeight: '500', color: '#ddd' }}>Get Matched with a Teacher</div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>Users with the skill you want to learn will see your request and can offer to teach you.</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ 
              minWidth: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              color: 'black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>3</div>
            <div>
              <div style={{ fontWeight: '500', color: '#ddd' }}>Coordinate and Learn</div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>Use our messaging system to finalize details and have your 1-hour lesson.</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ 
              minWidth: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              color: 'black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>4</div>
            <div>
              <div style={{ fontWeight: '500', color: '#ddd' }}>Complete the Lesson</div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>After the lesson, mark it as completed and 1 time credit will be transferred to the teacher.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillRequestPage;

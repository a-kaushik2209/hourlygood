import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useSkill } from '../contexts/SkillContext';

function ChatPage({ setPage }) {
  const { currentUser } = useAuth();
  const { chats, activeChat, setActiveChat, messages, sendMessage, loading: chatLoading } = useChat();
  const { completeLesson } = useSkill();
  
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [completingLesson, setCompletingLesson] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Get the current chat details
  const currentChat = chats.find(chat => chat.id === activeChat);
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() === '' || !activeChat || !currentUser) return;
    
    setSending(true);
    setError('');
    
    try {
      await sendMessage(activeChat, messageText.trim());
      setMessageText('');
    } catch (err) {
      setError('Failed to send message: ' + err.message);
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };
  
  // Handle marking a lesson as complete
  const handleMarkComplete = async (requestId) => {
    if (!requestId || !currentUser) return;
    
    setCompletingLesson(true);
    setError('');
    
    try {
      await completeLesson(requestId);
      alert('Lesson marked as complete! 1 time credit has been awarded to the tutor.');
    } catch (err) {
      setError('Failed to complete lesson: ' + err.message);
      console.error('Error completing lesson:', err);
    } finally {
      setCompletingLesson(false);
    }
  };
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser && !chatLoading) {
      setPage('login');
    }
  }, [currentUser, chatLoading, setPage]);

  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: '1rem auto' }}>
      <div style={{ 
        display: 'flex', 
        height: 'calc(100vh - 120px)', 
        background: '#1e1e1e', 
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Chat list sidebar */}
        <div style={{ 
          width: '300px', 
          borderRight: '1px solid #333',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
            <h2 style={{ color: 'var(--primary)', margin: '0 0 5px 0', fontSize: '1.3rem' }}>Messages</h2>
            <p style={{ color: '#aaa', margin: 0, fontSize: '14px' }}>Coordinate lessons with your teachers and students</p>
          </div>
          
          {chatLoading ? (
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⌛</div>
              <p style={{ color: '#aaa' }}>Loading conversations...</p>
            </div>
          ) : chats.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '50px', marginBottom: '20px' }}>💬</div>
              <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>No Messages Yet</h3>
              <p style={{ color: '#aaa', marginBottom: '20px' }}>
                Your message threads with tutors and students will appear here.
              </p>
              <button 
                onClick={() => setPage('marketplace')}
                style={{ 
                  background: 'var(--primary)', 
                  color: 'black', 
                  border: 'none', 
                  padding: '10px 15px', 
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Browse Requests
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {chats.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  style={{ 
                    padding: '15px 20px', 
                    borderBottom: '1px solid #333',
                    cursor: 'pointer',
                    background: activeChat === chat.id ? '#252525' : 'transparent',
                    transition: 'background 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: '#333', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '500'
                    }}>
                      {chat.otherParticipant?.name?.charAt(0) || '?'}
                    </div>
                    
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ 
                        fontWeight: '500', 
                        color: '#fff', 
                        marginBottom: '3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {chat.otherParticipant?.name || 'Unknown User'}
                      </div>
                      <div style={{ 
                        color: '#aaa', 
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {chat.request?.skillName || 'Skill Lesson'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    right: '20px', 
                    transform: 'translateY(-50%)',
                    color: '#aaa',
                    fontSize: '12px'
                  }}>
                    {chat.lastMessageTime ? new Date(chat.lastMessageTime.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Chat content */}
        {!currentChat ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>💬</div>
              <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Select a Conversation</h3>
              <p style={{ color: '#aaa', marginBottom: '20px' }}>
                Choose a conversation from the sidebar to start messaging.  
              </p>
            </div>
          </div>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Chat header */}
            <div style={{ 
              padding: '20px', 
              borderBottom: '1px solid #333',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: '#333', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '500'
                }}>
                  {currentChat.otherParticipant?.name?.charAt(0) || '?'}
                </div>
                
                <div>
                  <div style={{ fontWeight: '500', color: '#fff', marginBottom: '3px' }}>
                    {currentChat.otherParticipant?.name || 'Unknown User'}
                  </div>
                  <div style={{ color: '#aaa', fontSize: '13px' }}>
                    {currentChat.request?.skillName || 'Skill Lesson'}
                  </div>
                </div>
              </div>
              
              {currentChat.request && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setPage('request')}
                    style={{ 
                      background: '#333', 
                      color: '#ddd', 
                      border: 'none', 
                      padding: '10px 15px', 
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Reschedule
                  </button>
                  <button 
                    onClick={() => handleMarkComplete(currentChat.request.id)}
                    disabled={completingLesson}
                    style={{ 
                      background: completingLesson ? '#555' : 'var(--primary)', 
                      color: 'black', 
                      border: 'none', 
                      padding: '10px 15px', 
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: completingLesson ? 'not-allowed' : 'pointer',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {completingLesson ? 'Processing...' : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Mark Complete
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '50px', marginBottom: '20px' }}>💬</div>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Start the Conversation</h3>
                  <p style={{ color: '#aaa', maxWidth: '400px', margin: '0 auto' }}>
                    Send a message to coordinate your skill lesson details.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      style={{ 
                        marginBottom: '20px',
                        display: 'flex',
                        flexDirection: message.senderId === currentUser.uid ? 'row-reverse' : 'row'
                      }}
                    >
                      <div style={{ 
                        maxWidth: '70%',
                        background: message.senderId === currentUser.uid ? 'var(--primary)' : '#252525',
                        color: message.senderId === currentUser.uid ? 'black' : '#fff',
                        padding: '12px 16px',
                        borderRadius: '18px',
                        borderBottomLeftRadius: message.senderId === currentUser.uid ? '18px' : '4px',
                        borderBottomRightRadius: message.senderId === currentUser.uid ? '4px' : '18px',
                        position: 'relative'
                      }}>
                        <div style={{ marginBottom: '5px' }}>{message.text}</div>
                        <div style={{ 
                          fontSize: '11px', 
                          opacity: 0.7, 
                          textAlign: message.senderId === currentUser.uid ? 'right' : 'left',
                          marginTop: '2px'
                        }}>
                          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            {/* Message input */}
            <div style={{ 
              borderTop: '1px solid #333', 
              padding: '15px 20px',
              background: '#1e1e1e'
            }}>
              {error && (
                <div style={{ 
                  background: '#ff5252', 
                  color: 'white', 
                  padding: '10px 15px', 
                  borderRadius: '8px', 
                  marginBottom: '10px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                  style={{ 
                    flex: 1,
                    padding: '12px 15px',
                    borderRadius: '8px',
                    background: '#252525',
                    border: '1px solid #333',
                    color: '#fff',
                    fontSize: '15px',
                    cursor: sending ? 'not-allowed' : 'text'
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || messageText.trim() === ''}
                  style={{ 
                    background: (sending || messageText.trim() === '') ? '#555' : 'var(--primary)',
                    color: 'black',
                    border: 'none',
                    borderRadius: '8px',
                    width: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: (sending || messageText.trim() === '') ? 'not-allowed' : 'pointer'
                  }}
                >
                  {sending ? (
                    <span style={{ fontSize: '18px' }}>⌛</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
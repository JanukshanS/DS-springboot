// ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

// Inline API key (not recommended for production)
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Append instruction for short responses
      const prompt = `${input}. Answer me with a short sentence. Maximum 20 words.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      const botReply = { role: 'bot', content: response.text };
      setMessages([...updatedMessages, botReply]);
    } catch (error) {
      console.error('Error:', error.message);
      const errorMessage = { 
        role: 'bot', 
        content: "Sorry, I encountered an error. Please try again later." 
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      
      
      <div style={styles.chatWindow}>
        {messages.length === 0 ? (
          <div style={styles.welcomeMessage}>
            <div style={styles.welcomeTitle}>Welcome!</div>
            <div style={styles.welcomeText}>
              I'm your Food Express assistant. I'll keep my answers short and sweet - 
              maximum 20 words per response!
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.messageContent,
                  backgroundColor: msg.role === 'user' ? '#ff6700' : '#f0f0f0',
                  color: msg.role === 'user' ? '#fff' : '#333',
                }}
              >
                <div style={styles.messageRole}>{msg.role === 'user' ? 'You' : 'Food Express'}</div>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div style={styles.typingIndicator}>
            <div style={styles.typingDot}></div>
            <div style={styles.typingDot}></div>
            <div style={styles.typingDot}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={styles.inputContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={styles.input}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            ...styles.sendButton,
            opacity: loading || !input.trim() ? 0.6 : 1,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    // maxWidth: '500px',
    // margin: '20px auto',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    // borderRadius: '12px',
    overflow: 'hidden',
    // boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  header: {
    background: 'linear-gradient(135deg, #ff9f00 0%, #ff6700 100%)',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    margin: '0',
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '0.9rem',
    opacity: '0.9',
  },
  chatWindow: {
    height: '400px',
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  welcomeMessage: {
    textAlign: 'center',
    margin: 'auto',
    maxWidth: '80%',
  },
  welcomeTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
  },
  welcomeText: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.5',
  },
  message: {
    display: 'flex',
    gap: '8px',
  },
  messageContent: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '18px',
    fontSize: '0.95rem',
    lineHeight: '1.4',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  messageRole: {
    fontWeight: '600',
    fontSize: '0.8rem',
    marginBottom: '4px',
    opacity: '0.8',
  },
  typingIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    padding: '12px',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    opacity: '0.4',
    animation: 'typingAnimation 1.4s infinite ease-in-out',
  },
  inputContainer: {
    display: 'flex',
    padding: '12px',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
  },
  input: {
    flex: '1',
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '24px',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'border 0.2s',
  },
  sendButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#ff6700',
    color: 'white',
    border: 'none',
    marginLeft: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
};

export default ChatBot;
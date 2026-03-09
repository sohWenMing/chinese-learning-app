import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/client';

interface Message {
  sender: 'user' | 'bao_bao';
  text: string;
}

export const BaoBaoChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessage: Message = {
      sender: 'bao_bao',
      text: "Hi! I'm Bao Bao Panda! 🐼 Draw some Chinese characters and I'll help you learn them!",
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.chatWithBaoBao('hailey', input);
      const baoBaoMessage: Message = {
        sender: 'bao_bao',
        text: response.message,
      };
      setMessages(prev => [...prev, baoBaoMessage]);
    } catch (error) {
      console.error('Error chatting with Bao Bao:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        maxWidth: '500px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
    >
      <div style={{
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        🐼 Bao Bao Panda
      </div>

      <div style={{ 
        height: '300px', 
        overflowY: 'auto', 
        padding: '16px',
        background: '#f9f9f9'
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: '12px',
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: message.sender === 'user' ? '#667eea' : '#e0e0e0',
                color: message.sender === 'user' ? 'white' : '#333',
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'center', color: '#888' }}>
            Bao Bao is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '16px', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Talk to Bao Bao..."
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '2px solid #e0e0e0',
            borderRadius: '24px',
            fontSize: '16px',
            outline: 'none'
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '24px',
            color: 'white',
            fontWeight: 'bold',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.6 : 1
          }}
        >
          Send
        </button>
      </div>
    </motion.div>
  );
};

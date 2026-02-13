import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ChatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Navigate Assistant. Upload your resume to get started, or ask me any general interview questions."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/chat/history');
      if (response && Array.isArray(response.data) && response.data.length > 0) {
        setMessages(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    }
  };

  const sendMessage = async (content) => {
    setIsLoading(true);
    setError(null);

    // Optimistic update
    // Note: We use a temp ID or just rely on index. The backend uses 'role' and 'content'.
    const userMessage = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send only the new message content
      const response = await api.post('/chat', { message: content });

      const aiMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat Error:', err);
      // Try to extract the specific error message if available
      setError(err.message || 'Failed to send message. Please try again.');

      // Remove the optimistic user message if failed? 
      // For now, let's just leave it but maybe show error.
      // Or we could revert.
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = async () => {
    try {
      await api.delete('/chat/history');
      setMessages([{
        role: 'assistant',
        content: "Hello! I'm your Navigate Assistant. Upload your resume to get started, or ask me any general interview questions."
      }]);
    } catch (err) {
      console.error('Failed to clear history:', err);
      setError('Failed to clear history');
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, error, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
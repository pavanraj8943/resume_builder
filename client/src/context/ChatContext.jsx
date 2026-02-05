import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const ChatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your Navigate Assistant. Upload your resume to get started, or ask me any general interview questions."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (content) => {
    setIsLoading(true);
    setError(null);

    // Optimistic update
    const userMessage = { id: Date.now(), role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Prepare message history for context (last 10 messages)
      // Filter out ID and just keep role/content for the API
      const history = messages.concat(userMessage).slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await api.post('/chat', { messages: history });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.message
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat Error:', err);
      setError('Failed to send message. Please try again.');
      // Remove failed message or show error state? For simplicity just show error
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I encountered an error providing a response. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your Navigate Assistant. Upload your resume to get started, or ask me any general interview questions."
    }]);
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, error, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
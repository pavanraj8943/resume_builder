import { api } from './api';

const sendMessage = async (message, resumeId = null) => {
    const response = await api.post('/chat', { message, resumeId });
    return response;
};

const getChatHistory = async () => {
    const response = await api.get('/chat/history');
    return response.data;
};

const chatService = {
    sendMessage,
    getChatHistory
};

export default chatService;

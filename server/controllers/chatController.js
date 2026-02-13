const ChatMessage = require('../models/ChatMessage');
const aiService = require('../services/aiService');
const contextService = require('../services/contextService');

// @desc    Send a message to the AI and get a response
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { messages } = req.body;
    let messageContent = '';

    // Check if input is just the new message string or an object
    if (req.body.message) {
      messageContent = req.body.message;
    } else if (Array.isArray(messages)) {
      // Fallback if frontend sends array: take the last user message
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.role === 'user') {
        messageContent = lastMsg.content;
      }
    }

    if (!messageContent) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // 1. Get or Create Session
    let chatSession = await ChatMessage.findOne({ user: req.user.id }).sort({ 'sessionMetadata.lastActivity': -1 });

    if (!chatSession) {
      chatSession = await ChatMessage.create({
        user: req.user.id,
        messages: [],
        sessionMetadata: {
          title: 'General Assistant Chat'
        }
      });
    }

    // 2. Append User Message
    chatSession.messages.push({
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    });

    // 3. Build Context (Optional now)
    // Fetch resume context if available, but don't error if not
    let resumeContext = '';
    try {
      resumeContext = await contextService.getContext(req.user.id);
    } catch (err) {
      console.warn('Context retrieval failed, proceeding without context:', err.message);
    }

    // 4. Prepare messages for AI
    // We pass the full history (mapped to a clean structure)
    const historyForAI = chatSession.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // 5. Generate AI Response
    const aiResponseText = await aiService.generateResponse(historyForAI, resumeContext);

    // 6. Append AI Response
    chatSession.messages.push({
      role: 'assistant',
      content: aiResponseText,
      timestamp: new Date()
    });

    chatSession.sessionMetadata.lastActivity = new Date();
    await chatSession.save();

    // 7. Return response
    res.json({
      success: true,
      message: aiResponseText,
      data: chatSession
    });

  } catch (err) {
    console.error('Chat Error:', err);
    res.status(500).json({ message: 'Server Error processing chat message', error: err.message });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const chatSession = await ChatMessage.findOne({ user: req.user.id }).sort({ 'sessionMetadata.lastActivity': -1 });

    if (!chatSession) {
      return res.json({ success: true, data: [] });
    }

    res.json({
      success: true,
      data: chatSession.messages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error fetching history' });
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Private
exports.clearHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ user: req.user.id });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error clearing history' });
  }
};

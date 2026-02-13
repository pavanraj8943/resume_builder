const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI client
// Note: We are using the existing OPENAI_API_KEY env var which contains a Google API Key
let genAI;
let model;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('AIza')) {
    genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
} else {
    console.warn('WARNING: Valid Google API Key not found in OPENAI_API_KEY environment variable.');
}

const checkClient = () => {
    if (!model) {
        console.warn('AI service unavailable (model is null), using mock response.');
        return false;
    }
    return true;
};

exports.generateResponse = async (messages, context) => {
    try {
        if (!checkClient()) {
            return "I apologize, but I am currently unavailable. Please check the server configuration.";
        }

        // Construct the history for Gemini
        // Gemini expects parts with text
        // We need to incorporate the system prompt and context into the message flow or system instruction (if supported, otherwise prepend)

        let promptContext = `You are a helpful, expert technical assistant, similar to Stack Overflow's AI. 
        Your goal is to help developers with coding questions, debugging, and software architecture.
        Be concise, accurate, and provide code examples where appropriate.
        
        Context provided by user (Resume/Background):
        ${context || 'No specific context provided.'}
        `;

        // Map messages to Gemini format (user/model)
        // Note: Gemini uses 'user' and 'model' roles. OpenAI uses 'user' and 'assistant'.
        const history = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Start chat with history
        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // Send the new message (which is actually the last one in the 'messages' array passed in? 
        // Wait, standard practice in this codebase seems to be passing the *history* to this function, 
        // including the latest user message.
        // Let's look at chatController.js.
        // It passes: historyForAI = chatSession.messages.map(...) which INCLUDES the latest user message.
        // So 'messages' has the full history including the last user prompt.

        // We need to separate the *latest* message from the history for chat.sendMessage()
        // OR rely on history if we just want to send the prompt.

        // Actually, for Gemini startChat, 'history' should NOT include the very last message we want to send now.
        // So we pop the last message.

        const lastMessage = history.pop(); // Get the last user message
        const messageText = lastMessage.parts[0].text;

        // Prepend system prompt to the first message or use a separate technique.
        // Simple way: Prepend to the very first message if history is empty, 
        // or just send it as part of the current message if context is needed specifically now.
        // Let's prepend context to the current message for simplicity and statelessness defined here, 
        // OR if history exists, maybe it's already there? 
        // Only prepend context if it's a new session?
        // Since we re-establish context every request in this stateless service function, 
        // we might just prepend it to the message.

        const fullPrompt = `${promptContext}\n\nUser Query: ${messageText}`;

        const result = await chat.sendMessage(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (err) {
        console.error('Gemini Error:', err);
        return "I encountered an error processing your request. Please try again later.";
    }
};

// Deprecated/Stubbed Interview Functions
exports.generateInterviewQuestions = async () => [];
exports.evaluateAnswer = async () => ({});
exports.checkResumeAlignment = async () => ({});

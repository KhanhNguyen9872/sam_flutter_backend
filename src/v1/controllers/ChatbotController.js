const ChatbotModel = require('../models/Chatbot'); // Now Chatbot.js is your model
const ChatbotAPI = require('../utils/chatbot_api');

const getHistoryChatbot = async (req, res) => {
    const studentId = req.user.id;
    try {
      const [results, a] = await ChatbotModel.getHistoryChatbot(studentId);
      
      // If there are multiple results, sort them by created_at (ascending order)
      if (results && results.length > 1) {
        results.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
      
      res.json(results);
    } catch (error) {
      console.error('Error fetching chatbot history:', error);
      res.status(500).json({ error: 'Failed to fetch chatbot history' });
    }
  };
  

  const sendMessage = async (req, res) => {
    const studentId = req.user.id;
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
  
    try {
      // Save the user message
      await ChatbotModel.addUserMessage(message, studentId);
  
      // Retrieve chatbot history for the student
      const [historyResults] = await ChatbotModel.getHistoryChatbot(studentId);
      
      let historyTxt = '';
      if (historyResults && historyResults.length > 0) {
        // Sort by created_at (ascending order)
        historyResults.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        
        // Format each history entry as "1. Bot/User - message"
        historyTxt = historyResults.map((item, index) => {
          const sender = item.isBot === 1 ? 'Bot' : 'User';
          return `${index + 1}. ${sender} - ${item.message}`;
        }).join("\n");
      }
  
      // Build the system prompt with the chat history
      const systemPrompt = `
  Bạn là trợ lý AI thân thiện và chuyên nghiệp của ứng dụng học viên SAM EDTECH. Nhiệm vụ của bạn là hỗ trợ khách hàng trả lời các câu hỏi liên quan đến ứng dụng học viên. Hãy trả lời một cách rõ ràng, dễ hiểu và thân thiện, tập trung vào việc giải đáp thắc mắc của khách hàng. Không cung cấp thông tin hay hướng dẫn kỹ thuật dành cho nhà phát triển. Bên dưới là lịch sử đoạn chat, bạn có thể dựa vào chúng để trả lời
  - Lịch sử đoạn chat:
  ${historyTxt}
  `;
  
      // Get the bot reply from the Gemini API
      const botReply = await ChatbotAPI.geminiChatbot(systemPrompt, message);
  
      // Save the bot message
      await ChatbotModel.addBotMessage(botReply, studentId);
  
      // Return only the bot message in the response
      res.json({ content: botReply });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  };
  
  

const clearMessage = async (req, res) => {
  const studentId = req.user.id;
  try {
    await ChatbotModel.clearChatHistory(studentId);
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear messages' });
  }
};

module.exports = {
  getHistoryChatbot,
  sendMessage,
  clearMessage
};

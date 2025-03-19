const axios = require('axios');

const geminiChatbot = async (systemPrompt, userMessage) => {
  try {
    // Retrieve GEMINI_API_KEY from environment variables (.env file)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the environment variables.");
    }

    // Construct the API endpoint URL with the API key as a query parameter
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

    // Combine systemPrompt and userMessage into a single text prompt.
    // If systemPrompt is provided, it is concatenated with the trimmed userMessage.
    const promptText = systemPrompt 
      ? `\`\`\`${systemPrompt}\`\`\`\n\n\`\`\`CÂU HỎI CỦA HỌC VIÊN: ${userMessage.trim()}\`\`\``
      : userMessage.trim();

    // Prepare the request payload according to the Gemini API documentation
    const payload = {
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ]
    };

    // Send the POST request using Axios
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Extract the chatbot response from the API result
    const botResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return botResponse;
  } catch (error) {
    console.error("Error in geminiChatbot:", error);
    throw error;
  }
};

module.exports = { geminiChatbot };

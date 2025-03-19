const db = require('../utils/db'); // Adjust the path as needed

// Retrieve chatbot history for a given student
const getHistoryChatbot = async (studentId) => {
  return db.query(
    'SELECT message, isBot, created_at FROM history_chatbot WHERE student_id = ? ORDER BY created_at ASC',
    [studentId]
  );
};

// Save a user message (isBot = 0) and return the result (including insertId)
const addUserMessage = async (message, studentId) => {
  return db.query(
    'INSERT INTO history_chatbot (message, isBot, created_at, student_id) VALUES (?, ?, NOW(), ?)',
    [message, 0, studentId]
  );
};

// Save a bot message (isBot = 1) and return the result (including insertId)
const addBotMessage = async (message, studentId) => {
  return db.query(
    'INSERT INTO history_chatbot (message, isBot, created_at, student_id) VALUES (?, ?, NOW(), ?)',
    [message, 1, studentId]
  );
};

// Delete all chat history for a given student
const clearChatHistory = async (studentId) => {
  return db.query(
    'DELETE FROM history_chatbot WHERE student_id = ?',
    [studentId]
  );
};

module.exports = {
  getHistoryChatbot,
  addUserMessage,
  addBotMessage,
  clearChatHistory,
};

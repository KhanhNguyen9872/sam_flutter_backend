const express = require('express');
const router = express.Router();
const ChatbotController = require('../controllers/ChatbotController');
const auth = require('../middleware/auth'); // middleware that verifies JWT

// Ensure you have authentication middleware to populate req.user
// e.g., router.use(authMiddleware);

router.get('/history',auth, ChatbotController.getHistoryChatbot);
router.post('/message',auth, ChatbotController.sendMessage);
router.delete('/history',auth, ChatbotController.clearMessage);

module.exports = router;

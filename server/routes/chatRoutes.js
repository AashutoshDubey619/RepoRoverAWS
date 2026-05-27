const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimit');
const { askQuestion, getChatHistory, getChatList, deleteChatHistory } = require('../controllers/chatController');

router.post('/', chatLimiter, auth, askQuestion);
router.get('/history', auth, getChatHistory);
router.delete('/history', auth, deleteChatHistory);

module.exports = { chatRouter: router, getChatList };

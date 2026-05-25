const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimit');
const { askQuestion, getChatHistory, getChatList } = require('../controllers/chatController');

router.post('/', chatLimiter, auth, askQuestion);
router.get('/history', auth, getChatHistory);

module.exports = { chatRouter: router, getChatList };

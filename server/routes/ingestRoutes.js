const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { ingestLimiter } = require('../middleware/rateLimit');
const { ingestRepo } = require('../controllers/ingestController');

// io is injected from index.js so the controller can emit Socket.io events
module.exports = (io) => {
    router.post('/', ingestLimiter, auth, ingestRepo(io));
    return router;
};

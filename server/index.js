const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./database');
const { apiLimiter } = require('./middleware/rateLimit');
const authRoutes = require('./routes/authRoutes');
const { chatRouter, getChatList } = require('./routes/chatRoutes');
const auth = require('./middleware/auth');
const ingestRoutes = require('./routes/ingestRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRouter);
app.get('/api/chats', auth, getChatList);
app.use('/api/ingest', ingestRoutes(io)); // io injected for Socket.io support

io.on('connection', () => {});

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

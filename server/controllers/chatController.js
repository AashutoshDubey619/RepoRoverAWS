const { model } = require('../services/aiService');
const { getMatchesFromEmbeddings } = require('../vectorStore');
const ChatHistory = require('../models/ChatHistory');

const askQuestion = async (req, res) => {
    const { question, repoUrl } = req.body;
    if (!question) return res.status(400).json({ error: 'Question required' });

    const currentRepo = repoUrl
        ? repoUrl.replace(/\/$/, '').replace(/\.git$/, '')
        : 'Unknown-Repo';

    try {
        let chat = await ChatHistory.findOne({ userId: req.userId, repoUrl: currentRepo });
        if (!chat) chat = new ChatHistory({ userId: req.userId, repoUrl: currentRepo, messages: [], files: [] });

        chat.messages.push({ role: 'user', text: question });
        // Don't save yet; save once at the end with the bot response to avoid 2 DB calls

        // Parse @filename syntax
        const match = question.match(/@([a-zA-Z0-9.\-_/]+)/);
        let targetFile = match ? match[1] : null;

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // Prevent buffering if using a proxy like NGINX or compression middleware
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();

        const contextChunks = await getMatchesFromEmbeddings(question, 15, currentRepo, targetFile);
        const contextText = contextChunks
            .map(c => `FILE: ${c.path}\n${c.content}`)
            .join('\n\n');

        const prompt = `You are RepoRover, an elite Senior Software Engineer and architectural expert analyzing a GitHub repository.

ROLE & BEHAVIOR:
- Debug code, suggest high-quality improvements, and provide detailed, easy-to-understand explanations.
- If the user asks a conversational question (e.g., "Hi", "How are you?"), handle it naturally and politely without getting confused by the codebase context.
- Focus strictly on the primary application logic and main files. Ignore boilerplate, auto-generated files, configuration noise, or irrelevant dependency modules unless specifically asked about them.
- Format your response beautifully using standard Markdown. Use bolding, bullet points, and code blocks appropriately.
- IMPORTANT: Do NOT wrap your entire response in a single markdown code block. Only use code blocks for actual code snippets.

CONTEXT FILES EXTRACTED FROM THE REPOSITORY:
${contextText}

USER QUESTION: 
${question}

Your detailed response:`;

        const result = await model.generateContentStream(prompt);
        let fullAnswer = '';

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullAnswer += chunkText;
            
            // Send chunk to client
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }

        // Save complete interaction to DB
        chat.messages.push({ role: 'bot', text: fullAnswer });
        chat.lastAccessed = Date.now();
        await chat.save();

        // Close stream
        res.write(`data: [DONE]\n\n`);
        res.end();

    } catch (error) {
        console.error('[chat] Response generation failed:', error.message);
        // If headers are not sent, send JSON error. If already streaming, close stream with error event.
        if (!res.headersSent) {
            res.status(500).json({ error: 'Response failed' });
        } else {
            res.write(`data: ${JSON.stringify({ error: 'Response generation failed.' })}\n\n`);
            res.write(`data: [DONE]\n\n`);
            res.end();
        }
    }
};

const getChatHistory = async (req, res) => {
    const { repoUrl } = req.query;
    try {
        const chat = await ChatHistory.findOne({ userId: req.userId, repoUrl });
        res.json({
            messages: chat ? chat.messages : [],
            files: chat ? chat.files || [] : []
        });
    } catch (error) {
        console.error('[chat/history] Fetch failed:', error.message);
        res.status(500).json({ error: 'Fetch failed' });
    }
};

const getChatList = async (req, res) => {
    try {
        const chats = await ChatHistory.find({ userId: req.userId })
            .select('repoUrl lastAccessed')
            .sort({ lastAccessed: -1 });
        res.json(chats);
    } catch (error) {
        console.error('[chats] Fetch failed:', error.message);
        res.status(500).json({ error: 'Fetch failed' });
    }
};

const deleteChatHistory = async (req, res) => {
    const { repoUrl } = req.query;
    try {
        await ChatHistory.findOneAndDelete({ userId: req.userId, repoUrl });
        res.json({ message: 'Chat deleted' });
    } catch (error) {
        console.error('[chat/delete] Fetch failed:', error.message);
        res.status(500).json({ error: 'Deletion failed' });
    }
};

module.exports = { askQuestion, getChatHistory, getChatList, deleteChatHistory };

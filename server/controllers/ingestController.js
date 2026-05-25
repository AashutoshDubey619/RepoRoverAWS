const { getRepoStructure, downloadFiles } = require('../services/githubService');
const { processAndStore } = require('../vectorStore');
const ChatHistory = require('../models/ChatHistory');

// io is injected from the route so Socket.io events can be emitted
const ingestRepo = (io) => async (req, res) => {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: 'Repo URL required' });

    const cleanURL = repoUrl.replace(/\/$/, '').replace(/\.git$/, '');

    try {
        const parts = cleanURL.split('github.com/')[1].split('/');
        const owner = parts[0];
        const repo = parts[1];

        io.emit('progress', { stage: 'fetching', current: 0, total: 100 });
        const fileList = await getRepoStructure(owner, repo);
        console.log(`File list length: ${fileList.length}`);
        
        // downloadFiles now emits its own 'downloading' progress events
        const validFiles = (await downloadFiles(fileList, io)).map(f => ({ ...f, repoUrl: cleanURL }));
        console.log(`Valid files after download: ${validFiles.length}`);

        // processAndStore now emits its own 'indexing' progress events
        await processAndStore(validFiles, progress => io.emit('progress', progress));

        // Initialize ChatHistory so repo appears in sidebar immediately
        let chat = await ChatHistory.findOne({ userId: req.userId, repoUrl: cleanURL });
        if (!chat) {
            chat = new ChatHistory({ userId: req.userId, repoUrl: cleanURL, messages: [] });
            await chat.save();
        }

        res.json({ message: 'Scan completed', totalFiles: validFiles.length });
    } catch (error) {
        console.error('[ingest] Error:', error.message);
        io.emit('log', 'Error during ingestion');
        res.status(500).json({ error: error.message });
    }
};

module.exports = { ingestRepo };

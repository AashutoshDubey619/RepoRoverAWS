const { Pinecone } = require('@pinecone-database/pinecone');
const pLimit = require('p-limit');
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const dotenv = require('dotenv');
dotenv.config();

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

// Using the new model which has stricter rate limits
const embeddings = new GoogleGenerativeAIEmbeddings({
   model: "gemini-embedding-001",
   apiKey: process.env.GEMINI_API_KEY
});

// Helper: Sleep function for Rate Limiting
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function processAndStore(files, onProgress) {
    const index = pinecone.index("reporover"); 
    
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 100,
    });

    let totalVectors = 0;
    let processedFiles = 0;
    const limit = pLimit(10); // Process 10 files concurrently

    const promises = files.map(file => limit(async () => {
        if (!file.content || typeof file.content !== 'string') {
            processedFiles++;
            if (onProgress) onProgress({ stage: 'indexing', current: processedFiles, total: files.length });
            return;
        }
        
        // 1. Create text chunks from the file
        const chunks = await splitter.createDocuments([file.content]);
        
        // 2. BATCHING LOGIC: Process chunks in groups of 100 (increased from 10)
        const batchSize = 100; 
        
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batchChunks = chunks.slice(i, i + batchSize);
            const batchTexts = batchChunks.map(c => c.pageContent);

            let retries = 3;
            while (retries > 0) {
                try {
                    // 🚀 OPTIMIZATION: Send multiple texts at once
                    const batchVectors = await embeddings.embedDocuments(batchTexts);

                    // Prepare vectors for Pinecone
                    const ext = file.path.includes('.') ? file.path.split('.').pop().toLowerCase() : 'unknown';
                    const vectorsToUpsert = batchChunks.map((chunk, idx) => ({
                        id: `${file.path}-${Date.now()}-${i + idx}`,
                        values: batchVectors[idx],
                        metadata: {
                            path: file.path,
                            content: chunk.pageContent,
                            repoUrl: file.repoUrl || "",
                            extension: ext,
                        }
                    }));

                    // Upload to Pinecone
                    if (vectorsToUpsert.length > 0) {
                        await index.upsert(vectorsToUpsert);
                        totalVectors += vectorsToUpsert.length;
                        console.log(`✅ Indexed batch of ${vectorsToUpsert.length} chunks for ${file.path}`);
                    }
                    break; // Success, exit retry loop
                } catch (err) {
                    retries--;
                    console.error(`⚠️ Error in batch processing for ${file.path} (Retries left: ${retries}): ${err.message}`);
                    if (retries === 0) break;
                    // If we hit a rate limit error, wait before trying next batch
                    await sleep(5000);
                }
            }
        }
        
        processedFiles++;
        if (onProgress) onProgress({ stage: 'indexing', current: processedFiles, total: files.length });
    }));

    await Promise.all(promises);
    return totalVectors;
}

async function getMatchesFromEmbeddings(question, topK = 15, repoUrl = null, targetFile = null) {
    const index = pinecone.index("reporover");
    try {
        const queryEmbedding = await embeddings.embedQuery(question);

        // Filter Object
        const filter = {
            ...(repoUrl && { repoUrl: { $eq: repoUrl } }),
            ...(targetFile && { path: { $eq: targetFile } })
        };
        
        // If filter is completely empty (no repoUrl and no targetFile), set it to undefined to query all
        const finalFilter = Object.keys(filter).length > 0 ? filter : undefined;

        console.log(`🔍 Querying Pinecone with filter: ${JSON.stringify(finalFilter)}`);

        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: topK,
            includeMetadata: true,
            filter: finalFilter
        });

        console.log(`📊 Found ${queryResponse.matches.length} matches for question: "${question}"`);
        return queryResponse.matches.map(match => ({
            content: match.metadata.content,
            path: match.metadata.path,
            score: match.score
        }));
    } catch (error) {
        console.error(" Error querying Pinecone:", error);
        return [];
    }
}

module.exports = { processAndStore, getMatchesFromEmbeddings };
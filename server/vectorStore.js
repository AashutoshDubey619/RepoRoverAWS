const { Pinecone } = require('@pinecone-database/pinecone');
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
    
    // Loop through files sequentially (safer for rate limits than parallel processing)
    for (const file of files) {
        if (!file.content || typeof file.content !== 'string') continue;

        if (onProgress) onProgress(`⚡ Processing: ${file.path}`);
        
        // 1. Create text chunks from the file
        const chunks = await splitter.createDocuments([file.content]);
        
        // 2. BATCHING LOGIC: Process chunks in groups of 10
        // This means we send 1 API request instead of 10 separate ones.
        const batchSize = 10; 
        
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batchChunks = chunks.slice(i, i + batchSize);
            const batchTexts = batchChunks.map(c => c.pageContent);

            try {
                // 🚀 OPTIMIZATION: Send multiple texts at once
                // Uses 'embedDocuments' (plural) to get a list of vectors
                const batchVectors = await embeddings.embedDocuments(batchTexts);

                // Prepare vectors for Pinecone
                const vectorsToUpsert = batchChunks.map((chunk, idx) => ({
                    id: `${file.path}-${Date.now()}-${i + idx}`,
                    values: batchVectors[idx],
                    metadata: {
                        path: file.path,
                        content: chunk.pageContent,
                        repoUrl: file.repoUrl || "",
                    }
                }));

                // Upload to Pinecone
                if (vectorsToUpsert.length > 0) {
                    await index.upsert(vectorsToUpsert);
                    totalVectors += vectorsToUpsert.length;
                    console.log(`✅ Indexed batch of ${vectorsToUpsert.length} chunks for ${file.path}`);
                }

                // 🛑 SAFETY BRAKE: Wait 4 seconds after every batch
                // This keeps you under the 100 requests/minute limit safely.
                await sleep(4000); 

            } catch (err) {
                console.error(`⚠️ Error in batch processing for ${file.path}: ${err.message}`);
                // If we hit a rate limit error, wait longer (10s) before trying next batch
                await sleep(10000);
            }
        }
    }

    if (onProgress) onProgress(`🚀 COMPLETE: Stored ${totalVectors} vectors!`);
    return totalVectors;
}

async function getMatchesFromEmbeddings(question, topK = 15, repoUrl = null) {
    const index = pinecone.index("reporover");
    try {
        const queryEmbedding = await embeddings.embedQuery(question);

        // Filter Object
        const filter = repoUrl ? { repoUrl: { $eq: repoUrl } } : undefined;
        console.log(`🔍 Querying Pinecone with filter: ${JSON.stringify(filter)}`);

        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: topK,
            includeMetadata: true,
            filter: filter
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
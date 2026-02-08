// const { Pinecone } = require('@pinecone-database/pinecone');
// const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
// const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
// const dotenv = require('dotenv');
// dotenv.config();

// const pinecone = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY
// });

// const embeddings = new GoogleGenerativeAIEmbeddings({
//    model: "text-embedding-004",
//    apiKey: process.env.GEMINI_API_KEY
// });

// // Helper: Batch processing for parallel execution with limit
// async function processBatch(items, batchSize, processFn) {
//     for (let i = 0; i < items.length; i += batchSize) {
//         const batch = items.slice(i, i + batchSize);
//         await Promise.all(batch.map(processFn));
//     }
// }

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// async function processAndStore(files, onProgress) {
//     const index = pinecone.index("reporover"); 
    
//     const splitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 800,
//         chunkOverlap: 100,
//     });

//     let totalVectors = 0;
//     const batchSize = 5; 

//     const processFile = async (file) => {
//         if (!file.content || typeof file.content !== 'string') return;

//         if (onProgress) onProgress(`⚡ Processing: ${file.path}`);
        
//         const chunks = await splitter.createDocuments([file.content]);
//         const vectors = [];
        
//         await Promise.all(chunks.map(async (chunk) => {
//             try {
//                 await sleep(200); 
//                 const embeddingVector = await embeddings.embedQuery(chunk.pageContent);
                
//                 vectors.push({
//                     id: `${file.path}-${Date.now()}-${Math.random()}`,
//                     values: embeddingVector,
//                     metadata: {
//                         path: file.path,
//                         content: chunk.pageContent,
//                         repoUrl: file.repoUrl ,
//                     }
//                 });
//             } catch (err) {
//                 console.error(` Error embedding chunk: ${err.message}`);
//             }
//         }));

//         if (vectors.length > 0) {
//             await index.upsert(vectors);
//             totalVectors += vectors.length;
//             if (onProgress) onProgress(` Indexed: ${file.path} (${vectors.length} chunks)`);
//         }
//     };

//     await processBatch(files, batchSize, processFile);

//     if (onProgress) onProgress(`🚀 COMPLETE: Stored ${totalVectors} vectors!`);
//     return totalVectors;
// }


// async function getMatchesFromEmbeddings(question, topK = 15, repoUrl = null) {
//     const index = pinecone.index("reporover");
//     try {
//         const queryEmbedding = await embeddings.embedQuery(question);

//         // Filter Object
//         const filter = repoUrl ? { repoUrl: { $eq: repoUrl } } : undefined;
//         console.log(`🔍 Querying Pinecone with filter: ${JSON.stringify(filter)}`);

//         const queryResponse = await index.query({
//             vector: queryEmbedding,
//             topK: topK,
//             includeMetadata: true,
//             filter: filter
//         });

//         console.log(`📊 Found ${queryResponse.matches.length} matches for question: "${question}"`);
//         return queryResponse.matches.map(match => ({
//             content: match.metadata.content,
//             path: match.metadata.path,
//             score: match.score
//         }));
//     } catch (error) {
//         console.error(" Error querying Pinecone:", error);
//         return [];
//     }
// }

// module.exports = { processAndStore, getMatchesFromEmbeddings };

// // const { Pinecone } = require('@pinecone-database/pinecone');
// // const { GoogleGenerativeAI } = require("@google/generative-ai"); // Use Raw SDK
// // const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters"); // Or @langchain/textsplitters
// // const dotenv = require('dotenv');
// // dotenv.config();

// // // 1. Initialize Pinecone
// // const pinecone = new Pinecone({
// //     apiKey: process.env.PINECONE_API_KEY
// // });

// // // 2. Initialize Gemini Direct Client (Bypassing LangChain wrapper)

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

// // // Helper: Custom Embedding Function using Raw SDK
// // async function getEmbedding(text) {
// //     try {
// //         // Clean text to avoid API errors with empty strings
// //         const cleanText = text.replace(/\n/g, " ");
// //         const result = await model.embedContent(cleanText);
// //         return result.embedding.values;
// //     } catch (error) {
// //         console.error("❌ Gemini Embedding Error:", error.message);
// //         throw error;
// //     }
// // }

// // // Helper: Batch processing
// // async function processBatch(items, batchSize, processFn) {
// //     for (let i = 0; i < items.length; i += batchSize) {
// //         const batch = items.slice(i, i + batchSize);
// //         await Promise.all(batch.map(processFn));
// //     }
// // }

// // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // async function processAndStore(files, onProgress) {
// //     const index = pinecone.index("reporover"); 
    
// //     const splitter = new RecursiveCharacterTextSplitter({
// //         chunkSize: 800,
// //         chunkOverlap: 100,
// //     });

// //     let totalVectors = 0;
// //     const batchSize = 1; 

// //     const processFile = async (file) => {
// //         if (!file.content || typeof file.content !== 'string') return;

// //         if (onProgress) onProgress(`⚡ Processing: ${file.path}`);
        
// //         const chunks = await splitter.createDocuments([file.content]);
// //         const vectors = [];
        
// //         // Loop through chunks
// //         for (const chunk of chunks) {
// //             try {
// //                 await sleep(500); // Rate limit protection
                
// //                 // --- NEW DIRECT CALL ---
// //                 const embeddingVector = await getEmbedding(chunk.pageContent);
// //                 // -----------------------
                
// //                 vectors.push({
// //                     id: `${file.path}-${Date.now()}-${Math.random()}`,
// //                     values: embeddingVector,
// //                     metadata: {
// //                         path: file.path,
// //                         content: chunk.pageContent,
// //                         repoUrl: file.repoUrl || "", 
// //                     }
// //                 });
// //             } catch (err) {
// //                 console.error(`⚠️ Error embedding chunk in ${file.path}: ${err.message}`);
// //             }
// //         }

// //         if (vectors.length > 0) {
// //             await index.upsert(vectors);
// //             totalVectors += vectors.length;
// //             if (onProgress) onProgress(`✅ Indexed: ${file.path} (${vectors.length} chunks)`);
// //         }
// //     };

// //     await processBatch(files, batchSize, processFile);

// //     if (onProgress) onProgress(`🚀 COMPLETE: Stored ${totalVectors} vectors!`);
// //     return totalVectors;
// // }


// // async function getMatchesFromEmbeddings(question, topK = 15, repoUrl = null) {
// //     const index = pinecone.index("reporover");
// //     try {
// //         // --- NEW DIRECT CALL ---
// //         const queryEmbedding = await getEmbedding(question);
// //         // -----------------------

// //         const filter = repoUrl ? { repoUrl: { $eq: repoUrl } } : undefined;
// //         console.log(`🔍 Querying Pinecone with filter: ${JSON.stringify(filter)}`);

// //         const queryResponse = await index.query({
// //             vector: queryEmbedding,
// //             topK: topK,
// //             includeMetadata: true,
// //             filter: filter
// //         });

// //         console.log(`📊 Found ${queryResponse.matches.length} matches`);
// //         return queryResponse.matches.map(match => ({
// //             content: match.metadata ? match.metadata.content : "",
// //             path: match.metadata ? match.metadata.path : "",
// //             score: match.score
// //         }));
// //     } catch (error) {
// //         console.error("❌ Error querying Pinecone:", error);
// //         return [];
// //     }
// // }

// // module.exports = { processAndStore, getMatchesFromEmbeddings };

const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const dotenv = require('dotenv');
dotenv.config();

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

// ✅ LangChain automatically handles the model name correctly now
const embeddings = new GoogleGenerativeAIEmbeddings({
   model: "embedding-001",
   apiKey: process.env.GEMINI_API_KEY
});

// Helper: Batch processing
async function processBatch(items, batchSize, processFn) {
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        await Promise.all(batch.map(processFn));
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function processAndStore(files, onProgress) {
    const index = pinecone.index("reporover"); 
    
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 100,
    });

    let totalVectors = 0;
    const batchSize = 1; // Safety batch size

    const processFile = async (file) => {
        if (!file.content || typeof file.content !== 'string') return;

        if (onProgress) onProgress(`⚡ Processing: ${file.path}`);
        
        const chunks = await splitter.createDocuments([file.content]);
        const vectors = [];
        
        // Loop for safety
        for (const chunk of chunks) {
            try {
                await sleep(500); // Small delay to avoid 429 errors
                
                const embeddingVector = await embeddings.embedQuery(chunk.pageContent);
                
                vectors.push({
                    id: `${file.path}-${Date.now()}-${Math.random()}`,
                    values: embeddingVector,
                    metadata: {
                        path: file.path,
                        content: chunk.pageContent,
                        repoUrl: file.repoUrl || "",
                    }
                });
            } catch (err) {
                console.error(`⚠️ Error embedding chunk in ${file.path}: ${err.message}`);
            }
        }

        if (vectors.length > 0) {
            await index.upsert(vectors);
            totalVectors += vectors.length;
            if (onProgress) onProgress(`✅ Indexed: ${file.path} (${vectors.length} chunks)`);
        }
    };

    await processBatch(files, batchSize, processFile);

    if (onProgress) onProgress(`🚀 COMPLETE: Stored ${totalVectors} vectors!`);
    return totalVectors;
}


async function getMatchesFromEmbeddings(question, topK = 15, repoUrl = null) {
    const index = pinecone.index("reporover");
    try {
        const queryEmbedding = await embeddings.embedQuery(question);

        const filter = repoUrl ? { repoUrl: { $eq: repoUrl } } : undefined;
        console.log(`🔍 Querying Pinecone with filter: ${JSON.stringify(filter)}`);

        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: topK,
            includeMetadata: true,
            filter: filter
        });

        console.log(`📊 Found ${queryResponse.matches.length} matches`);
        return queryResponse.matches.map(match => ({
            content: match.metadata ? match.metadata.content : "",
            path: match.metadata ? match.metadata.path : "",
            score: match.score
        }));
    } catch (error) {
        console.error("❌ Error querying Pinecone:", error);
        return [];
    }
}

module.exports = { processAndStore, getMatchesFromEmbeddings };
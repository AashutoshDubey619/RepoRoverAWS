const axios = require('axios');

const ignorePatterns = [
    'node_modules', 'dist', 'build', 'coverage', '.git', '.next', '.vercel',
    'package-lock.json', 'yarn.lock', '.turbo', '.cache', '.output'
];

const isCodeFile = (filename) => !ignorePatterns.some(p => filename.includes(p));

async function getRepoStructure(owner, repo, path = '') {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        console.log(`API response for ${path}: ${response.data.length} items`);
        let allFiles = [];
        for (const item of response.data) {
            if (item.type === 'dir') {
                if (ignorePatterns.some(p => item.name.includes(p))) continue;
                const subFiles = await getRepoStructure(owner, repo, item.path);
                allFiles = allFiles.concat(subFiles);
            } else if (item.type === 'file' && isCodeFile(item.name)) {
                allFiles.push({
                    name: item.name,
                    path: item.path,
                    download_url: item.download_url
                });
            }
        }
        return allFiles;
    } catch (error) {
        console.error(`[getRepoStructure] Failed for path=${path}:`, error.message);
        return [];
    }
}

async function downloadFiles(fileList, io) {
    const pLimit = require('p-limit');
    const limit = pLimit(50);
    let downloadedCount = 0;

    const filePromises = fileList.map(file => limit(async () => {
        try {
            const contentRes = await axios.get(file.download_url);
            downloadedCount++;
            io.emit('progress', { stage: 'downloading', current: downloadedCount, total: fileList.length });
            return { ...file, content: contentRes.data };
        } catch (error) {
            console.error(`[ingest] Failed to download ${file.path}:`, error.message);
            return null;
        }
    }));

    return (await Promise.all(filePromises)).filter(Boolean);
}

module.exports = { getRepoStructure, downloadFiles };

const axios = require('axios');

// ── FILTERING RULES ──────────────────────────────────────────────────────────
// Three layers of filtering ensure only meaningful source code gets indexed.

// Layer 1: Directories to skip entirely during repository traversal
const IGNORE_DIRS = new Set([
    'node_modules', 'dist', 'build', 'coverage', '.git', '.next', '.vercel',
    '.turbo', '.cache', '.output', '__pycache__', '.idea', '.vscode',
    'target', 'bin', 'obj', '.gradle', '.mvn', '.settings',
    'vendor', '.bundle', 'bower_components', '.expo', '.nuxt',
]);

// Layer 2: File extensions that are binary, media, or non-code (never useful for analysis)
const SKIP_EXTENSIONS = new Set([
    // Images
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.bmp', '.webp', '.svg', '.avif', '.tiff',
    // Fonts
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    // Media
    '.mp3', '.mp4', '.avi', '.mov', '.wav', '.ogg', '.webm', '.flac',
    // Archives
    '.zip', '.tar', '.gz', '.rar', '.7z', '.jar', '.war', '.ear',
    // Documents
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    // Source maps
    '.map',
    // Binary / Compiled
    '.exe', '.dll', '.so', '.dylib', '.bin', '.dat', '.class', '.o', '.pyc', '.pyo',
    // Database
    '.sqlite', '.db',
    // Lock files
    '.lock',
]);

// Layer 3: Specific filenames to always skip (boilerplate, noise, OS junk)
const SKIP_FILENAMES = new Set([
    // Lock files
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'composer.lock', 'Gemfile.lock', 'Cargo.lock', 'poetry.lock',
    // Ignore / lint config
    '.gitignore', '.npmignore', '.dockerignore',
    '.eslintignore', '.prettierignore',
    '.editorconfig', '.prettierrc', '.browserslistrc', '.babelrc',
    // License files
    'LICENSE', 'LICENSE.md', 'LICENSE.txt',
    'LICENCE', 'LICENCE.md', 'LICENCE.txt',
    // OS junk
    '.DS_Store', 'Thumbs.db',
    // Build wrapper boilerplate (auto-generated, never meaningful code)
    'mvnw', 'mvnw.cmd', 'gradlew', 'gradlew.bat',
]);

/**
 * Determines if a file is worth indexing for code analysis.
 * Blocks binary files, media, boilerplate, and lock files.
 */
const isCodeFile = (filename) => {
    const baseName = filename.split('/').pop();

    // Check exact filename blacklist
    if (SKIP_FILENAMES.has(baseName)) return false;

    // Check extension blacklist
    const lastDot = baseName.lastIndexOf('.');
    if (lastDot !== -1) {
        const ext = baseName.substring(lastDot).toLowerCase();
        if (SKIP_EXTENSIONS.has(ext)) return false;
    }

    return true;
};

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
                if (IGNORE_DIRS.has(item.name)) continue;
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
    const limit = pLimit(50); // Maximum speed limit restored
    let downloadedCount = 0;

    const filePromises = fileList.map(file => limit(async () => {
        try {
            const contentRes = await axios.get(file.download_url);
            downloadedCount++;
            io.emit('progress', { stage: 'downloading', current: downloadedCount, total: fileList.length });

            // Fix: axios auto-parses JSON files into objects, which causes
            // processAndStore to silently skip them. Convert back to string.
            let content = contentRes.data;
            if (typeof content !== 'string') {
                content = JSON.stringify(content, null, 2);
            }

            return { ...file, content };
        } catch (error) {
            console.error(`[ingest] Failed to download ${file.path}:`, error.message);
            return null;
        }
    }));

    return (await Promise.all(filePromises)).filter(Boolean);
}

module.exports = { getRepoStructure, downloadFiles };

import { Github, Loader2, Sparkles } from 'lucide-react';

export default function RepoInput({ repoUrl, setRepoUrl, onAnalyze, isScanning }) {
    return (
        <div className="p-4 border-b border-zinc-800 bg-black/50 backdrop-blur-md z-30 flex flex-col md:flex-row gap-3 items-stretch md:items-center sticky top-0">
            <div className="relative flex-1 group transition-all duration-300">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-md blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10 group-focus-within:text-white transition-colors" />
                <input
                    type="text"
                    placeholder="https://github.com/owner/repo"
                    className="relative w-full pl-10 pr-4 py-2.5 bg-zinc-900 rounded-md border border-zinc-800 focus:border-zinc-600 focus:ring-0 focus:outline-none text-sm text-white placeholder-zinc-600 font-mono transition-all shadow-sm"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    disabled={isScanning}
                />
            </div>
            <button
                onClick={onAnalyze}
                disabled={isScanning || !repoUrl}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-white text-black rounded-md font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md whitespace-nowrap"
            >
                {isScanning ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                {isScanning ? 'Scanning' : 'Analyze'}
            </button>
        </div>
    );
}

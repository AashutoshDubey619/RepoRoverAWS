import { Loader2 } from 'lucide-react';

export default function IngestionLogs({ progress }) {
    if (!progress) return null;

    const { stage, current, total } = progress;
    
    let percent = 0;
    let label = 'Initializing...';

    if (stage === 'fetching') {
        percent = 10;
        label = 'Discovering repository files...';
    } else if (stage === 'downloading') {
        percent = 10 + ((current / total) * 40); // 10% to 50%
        label = `Downloading files (${current}/${total})...`;
    } else if (stage === 'indexing') {
        percent = 50 + ((current / total) * 50); // 50% to 100%
        label = `Analyzing and indexing (${current}/${total})...`;
    }

    if (isNaN(percent)) percent = 0;

    return (
        <div className="mx-4 md:mx-12 mt-4 p-6 bg-[#0a0a0a] border border-zinc-800 rounded-xl shadow-lg flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center text-sm font-medium text-zinc-300">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                    <span>{label}</span>
                </div>
                <span className="text-zinc-500 font-mono">{Math.round(percent)}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

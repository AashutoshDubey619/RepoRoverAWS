import { Github, ChevronRight, Plus, User, LogOut } from 'lucide-react';
import Logo from './Logo';

export default function Sidebar({ repoUrl, chatHistoryList, onNewChat, onLoadChat, onLogout, username }) {
    return (
        <>
            {/* Desktop Sidebar Header */}
            <div className="p-4 border-b border-zinc-800 hidden md:block">
                <div className="flex items-center gap-3 mb-4 group cursor-default">
                    <Logo size="sm" />
                    <h1 className="text-lg font-bold tracking-tight text-zinc-100 group-hover:text-purple-400 transition-colors">
                        RepoRover
                    </h1>
                </div>
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 rounded-md font-medium text-sm hover:bg-zinc-200 transition-all shadow-md active:scale-95"
                >
                    <Plus className="w-4 h-4" /> New Chat
                </button>
            </div>

            {/* Mobile New Chat Button */}
            <div className="p-4 md:hidden mt-16">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 rounded-md font-medium text-sm hover:bg-zinc-200 transition-all shadow-md active:scale-95"
                >
                    <Plus className="w-4 h-4" /> New Chat
                </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-2 mb-1">
                    Recent Repositories
                </div>
                {chatHistoryList.length === 0 ? (
                    <div className="text-zinc-600 text-xs px-3 italic">No history yet.</div>
                ) : (
                    chatHistoryList.map((chat, idx) => (
                        <button
                            key={idx}
                            onClick={() => onLoadChat(chat.repoUrl)}
                            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all group mb-1
                                ${repoUrl === chat.repoUrl
                                    ? 'bg-zinc-900 text-white border border-zinc-700 shadow-sm'
                                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'}
                            `}
                        >
                            <Github className="w-4 h-4 shrink-0 opacity-70 group-hover:text-purple-400 transition-colors" />
                            <span className="truncate font-mono text-xs flex-1 text-left">
                                {chat.repoUrl.replace('https://github.com/', '')}
                            </span>
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                        </button>
                    ))
                )}
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-zinc-800 bg-black">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-700">
                            <User className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-zinc-200 truncate max-w-[120px]" title={username}>
                                {username}
                            </span>
                            <span className="text-[10px] text-green-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-md"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </>
    );
}

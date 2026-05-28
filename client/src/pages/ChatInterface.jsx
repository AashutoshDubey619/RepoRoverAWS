import { useState, useEffect, useRef } from 'react';
import { Bot, Loader2, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import Sidebar from '../components/Sidebar';
import RepoInput from '../components/Chat/RepoInput';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import IngestionLogs from '../components/Chat/IngestionLogs';
import api from '../utils/api';

const WELCOME_MSG = { role: 'bot', text: 'Ready to analyze. Enter a GitHub repository URL to begin.' };

export default function ChatInterface() {
    const navigate = useNavigate();
    const { username, logout } = useAuth();

    const [repoUrl, setRepoUrl] = useState('');
    const [status, setStatus] = useState('idle');
    const [messages, setMessages] = useState([WELCOME_MSG]);
    const [repoFiles, setRepoFiles] = useState([]);
    const [progress, setProgress] = useState(null);
    const [chatHistoryList, setChatHistoryList] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const chatEndRef = useRef(null);
    const isBotReplying = useRef(false);

    useSocket((data) => setProgress(data));

    useEffect(() => {
        if (!isBotReplying.current) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, progress, status]);

    const fetchChatList = async () => {
        try {
            const res = await api.get('/api/chats');
            setChatHistoryList(res.data);
        } catch {
            console.error('Failed to fetch chat list');
        }
    };

    useEffect(() => { fetchChatList(); }, []);

    const startNewChat = () => {
        isBotReplying.current = false;
        setRepoUrl('');
        setMessages([WELCOME_MSG]);
        setRepoFiles([]);
        setStatus('idle');
        setProgress(null);
        setIsSidebarOpen(false);
    };

    const loadChat = async (url) => {
        isBotReplying.current = false;
        setRepoUrl(url);
        setStatus('ready');
        setIsSidebarOpen(false);
        try {
            const res = await api.get(`/api/chat/history?repoUrl=${url}`);
            setMessages(res.data.messages.length > 0 ? res.data.messages : [WELCOME_MSG]);
            setRepoFiles(res.data.files || []);
        } catch (error) {
            console.error('Failed to load chat:', error);
            setMessages([WELCOME_MSG]);
            setRepoFiles([]);
        }
    };

    const handleIngest = async () => {
        if (!repoUrl) return;
        isBotReplying.current = false;
        setStatus('scanning');
        setProgress(null);
        try {
            const res = await api.post('/api/ingest', { repoUrl });
            setStatus('ready');
            setRepoFiles(res.data.files || []);
            setMessages(prev => [...prev, {
                role: 'bot',
                text: `Analysis complete. Indexed ${res.data.totalFiles} files. System ready for queries.`
            }]);
            fetchChatList();
        } catch (err) {
            setStatus('idle');
            setMessages(prev => [...prev, { role: 'bot', text: 'Error: Failed to process repository.' }]);
        }
    };

    const handleAsk = async (userQ) => {
        if (!userQ) return;
        isBotReplying.current = false; // Scroll down for user message
        setMessages(prev => [...prev, { role: 'user', text: userQ }]);
        setStatus('chatting');
        
        try {
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reporoveraws.onrender.com';
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ question: userQ, repoUrl })
            });

            if (!response.ok) throw new Error('API Error');

            isBotReplying.current = true; // Block scroll for bot response
            
            // Append an empty bot message instantly and remove "Thinking..."
            setMessages(prev => [...prev, { role: 'bot', text: '' }]);
            setStatus('ready'); 

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '').trim();
                        if (!dataStr) continue;
                        if (dataStr === '[DONE]') {
                            fetchChatList();
                            return;
                        }
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.text) {
                                setMessages(prev => {
                                    const newMsgs = [...prev];
                                    const lastIdx = newMsgs.length - 1;
                                    newMsgs[lastIdx] = { 
                                        ...newMsgs[lastIdx], 
                                        text: newMsgs[lastIdx].text + data.text 
                                    };
                                    return newMsgs;
                                });
                            } else if (data.error) {
                                setMessages(prev => {
                                    const newMsgs = [...prev];
                                    const lastIdx = newMsgs.length - 1;
                                    newMsgs[lastIdx] = { 
                                        ...newMsgs[lastIdx], 
                                        text: newMsgs[lastIdx].text + `\n**Error:** ${data.error}` 
                                    };
                                    return newMsgs;
                                });
                            }
                        } catch (e) {
                            // Sometimes chunks combine, ignore partial JSON parse errors
                        }
                    }
                }
            }
        } catch {
            isBotReplying.current = true;
            setMessages(prev => [...prev, { role: 'bot', text: 'Error generating response.' }]);
            setStatus('ready');
        }
    };

    const handleDeleteChat = async (url) => {
        try {
            await api.delete(`/api/chat/history?repoUrl=${url}`);
            if (repoUrl === url) startNewChat(); // if deleting current chat, reset UI
            fetchChatList();
        } catch (error) {
            console.error('Failed to delete chat:', error);
        }
    };

    const handleExportChat = () => {
        let md = `# RepoRover Chat Export\n\n**Repository:** ${repoUrl || 'Unknown'}\n\n---\n\n`;
        messages.forEach(m => {
            if (m.role === 'bot' && m.text.includes('Ready to analyze')) return;
            const roleName = m.role === 'user' ? '👤 **You**' : '🤖 **RepoRover**';
            md += `${roleName}\n\n${m.text}\n\n---\n\n`;
        });
        
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporover-chat-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black overflow-hidden">

            {/* 📱 Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold shadow-sm">
                        <Bot className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">RepoRover</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-400 hover:text-white">
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* 🌑 Mobile Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* 📂 Sidebar */}
            <div className={`fixed md:static inset-y-0 left-0 z-50 w-[300px] flex flex-col border-r border-zinc-800 bg-black transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <Sidebar
                    repoUrl={repoUrl}
                    chatHistoryList={chatHistoryList}
                    onNewChat={startNewChat}
                    onLoadChat={loadChat}
                    onDeleteChat={handleDeleteChat}
                    onLogout={logout}
                    username={username}
                />
            </div>

            {/* 💬 Main Chat Area */}
            <div className="flex-1 flex flex-col relative bg-zinc-950 min-w-0 pt-16 md:pt-0">
                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

                <RepoInput
                    repoUrl={repoUrl}
                    setRepoUrl={setRepoUrl}
                    onAnalyze={handleIngest}
                    onExport={handleExportChat}
                    isScanning={status === 'scanning'}
                    hasMessages={messages.length > 1}
                />

                {/* Messages */}
                <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-8 scroll-smooth relative z-10 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <ChatMessage key={idx} role={msg.role} text={msg.text} />
                    ))}

                    {status === 'chatting' && (
                        <div className="flex gap-4 animate-pulse ml-12">
                            <div className="text-zinc-500 text-xs font-mono flex items-center gap-2">
                                <Loader2 className="animate-spin w-3 h-3" /> Thinking...
                            </div>
                        </div>
                    )}

                    {status === 'scanning' && <IngestionLogs progress={progress} />}

                    <div ref={chatEndRef} />
                </div>

                <ChatInput
                    onAsk={handleAsk}
                    disabled={status !== 'ready'}
                    repoFiles={repoFiles}
                />
            </div>
        </div>
    );
}
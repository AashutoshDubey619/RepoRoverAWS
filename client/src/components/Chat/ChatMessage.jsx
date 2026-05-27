import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bot, User, Copy, Check } from 'lucide-react';

// Custom theme: oneDark colors but NO line backgrounds
const codeTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
        ...oneDark['pre[class*="language-"]'],
        background: 'transparent',
        margin: 0,
        padding: 0,
    },
    'code[class*="language-"]': {
        ...oneDark['code[class*="language-"]'],
        background: 'transparent',
    },
};

function CopyButton({ code }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
        >
            {copied
                ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
                : <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
            }
        </button>
    );
}

export default function ChatMessage({ role, text }) {
    return (
        <div className={`flex gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm transition-transform hover:scale-105
                ${role === 'bot'
                    ? 'bg-zinc-900 border-zinc-700 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                    : 'bg-white text-black border-white'}`}>
                {role === 'bot' ? <Bot className="w-5 h-5 text-purple-400" /> : <User className="w-5 h-5" />}
            </div>

            {/* Message bubble */}
            <div className={`max-w-[85%] overflow-hidden text-[14px] md:text-[15px] leading-7
                ${role === 'user'
                    ? 'bg-zinc-900 px-4 py-2.5 rounded-2xl text-white font-medium border border-zinc-800 shadow-sm'
                    : 'text-zinc-200'}`}>

                {role === 'user' ? (
                    <span>{text}</span>
                ) : (
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => (
                                <p className="mb-3 last:mb-0 leading-7 text-zinc-200">{children}</p>
                            ),
                            h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-5 mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-4 mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-semibold text-zinc-100 mt-3 mb-1">{children}</h3>,
                            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
                            ul: ({ children }) => <ul className="mb-3 ml-5 space-y-1 list-disc marker:text-purple-400">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-3 ml-5 space-y-1 list-decimal marker:text-purple-400">{children}</ol>,
                            li: ({ children }) => <li className="text-zinc-200 leading-7 pl-1">{children}</li>,
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-purple-500 pl-4 my-3 text-zinc-400 italic">{children}</blockquote>
                            ),
                            a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 underline underline-offset-2">{children}</a>
                            ),
                            hr: () => <hr className="border-zinc-800 my-4" />,

                            // Inline code — stays inline, no block
                            code: ({ children, className }) => {
                                if (!className) {
                                    return (
                                        <code className="bg-zinc-800 text-purple-300 px-1.5 py-0.5 rounded text-[13px] font-mono border border-zinc-700/60 whitespace-nowrap">
                                            {children}
                                        </code>
                                    );
                                }
                                return <code className={className}>{children}</code>;
                            },

                            // Fenced code block — full syntax highlighting + copy button
                            pre: ({ children }) => {
                                const child = children?.props;
                                const className = child?.className || '';
                                const language = className.replace('language-', '') || 'plaintext';
                                const code = String(child?.children || '').replace(/\n$/, '');

                                return (
                                    <div className="my-4 rounded-xl overflow-hidden border border-zinc-700/50 shadow-lg">
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/80 border-b border-zinc-700/50">
                                            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                                                {language === 'plaintext' ? 'code' : language}
                                            </span>
                                            <CopyButton code={code} />
                                        </div>
                                        {/* Code */}
                                        <div className="bg-[#141414] overflow-x-auto">
                                            <SyntaxHighlighter
                                                language={language}
                                                style={codeTheme}
                                                customStyle={{
                                                    margin: 0,
                                                    padding: '1rem 1.25rem',
                                                    background: 'transparent',
                                                    fontSize: '13px',
                                                    lineHeight: '1.65',
                                                }}
                                                showLineNumbers={code.split('\n').length > 4}
                                                lineNumberStyle={{ color: '#4b5563', fontSize: '11px', minWidth: '2.5rem', userSelect: 'none' }}
                                                PreTag="div"
                                            >
                                                {code}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>
                                );
                            },
                        }}
                    >
                        {text}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    );
}

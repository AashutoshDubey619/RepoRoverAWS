import { useRef, useEffect, useState } from 'react';
import { Send, Command } from 'lucide-react';

export default function ChatInput({ onAsk, disabled }) {
    const [localQuestion, setLocalQuestion] = useState('');
    const textareaRef = useRef(null);

    const SMART_PROMPTS = [
        "Explain the main architecture of this repository",
        "Find any potential bugs or security issues",
        "Suggest performance optimizations"
    ];

    // Auto-resize textarea height based on content
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';                          // shrink first
        el.style.height = Math.min(el.scrollHeight, 200) + 'px'; // grow up to 200px
    }, [localQuestion]);

    const handleAskSubmit = () => {
        if (!disabled && localQuestion.trim()) {
            onAsk(localQuestion.trim());
            setLocalQuestion('');
        }
    };

    const handleKeyDown = (e) => {
        // Enter sends, Shift+Enter adds a new line (like ChatGPT)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAskSubmit();
        }
    };

    return (
        <div className="p-4 md:p-6 bg-zinc-950 border-t border-zinc-900 shrink-0">
            {/* Smart Prompts */}
            {!disabled && (
                <div className="max-w-4xl mx-auto flex flex-wrap gap-2 mb-3">
                    {SMART_PROMPTS.map((prompt, idx) => (
                        <button
                            key={idx}
                            onClick={() => setLocalQuestion(prompt)}
                            className="text-xs px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-full transition-colors whitespace-nowrap"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            <div className="max-w-4xl mx-auto relative group">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />

                <div className="relative flex gap-2 md:gap-3 items-end bg-black rounded-xl p-3 border border-zinc-800 focus-within:border-zinc-600 transition-colors shadow-2xl">
                    {/* Cmd icon */}
                    <div className="pb-1 text-zinc-600 hidden md:block shrink-0">
                        <Command className="w-4 h-4" />
                    </div>

                    {/* Auto-expanding textarea */}
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder="Ask about the code...  (Shift+Enter for new line)"
                        className="flex-1 resize-none bg-transparent text-white placeholder-zinc-600 focus:outline-none text-sm font-medium leading-6 py-1 min-w-0 max-h-[200px] overflow-y-auto custom-scrollbar"
                        value={localQuestion}
                        onChange={(e) => setLocalQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                    />

                    {/* Send button — aligned to bottom-right */}
                    <button
                        onClick={handleAskSubmit}
                        disabled={disabled || !localQuestion.trim()}
                        className="p-2 bg-white hover:bg-zinc-200 rounded-lg text-black transition-all disabled:opacity-40 shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] self-end"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-[10px] text-zinc-700 text-center mt-2">
                    Enter to send &nbsp;·&nbsp; Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}

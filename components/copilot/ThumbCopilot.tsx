
import React, { useState, useEffect } from 'react';
import { ThumbCopilotContext, ChatMessage } from '../../types';
import { MessageCircleIcon, XIcon, SparklesIcon } from '../icons';
import { mockAskCopilot } from '../../services/mockServices';

interface Props {
    context: ThumbCopilotContext;
    onApplySuggestion: (type: string, value: any) => void;
}

export const ThumbCopilot = ({ context, onApplySuggestion }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'intro', role: 'assistant', content: "Hi! I'm ThumbCopilot. I can help you write hooks, suggest remix ideas, or analyze your thumbnail." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim()) return;
        
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate API Call
        const response = await mockAskCopilot(context, text);
        
        // Hydrate suggestions with actual callbacks based on context
        if (context.step === 'polish' && text.includes('hook')) {
            response.suggestions = [
                { label: "Use 'I WAS WRONG'", action: () => onApplySuggestion('overlayText', "I WAS WRONG") },
                { label: "Use 'THE TRUTH'", action: () => onApplySuggestion('overlayText', "THE TRUTH") },
            ];
        }

        setMessages(prev => [...prev, response]);
        setIsTyping(false);
    };

    const QuickAction = ({ label, prompt }: { label: string, prompt: string }) => (
        <button 
            onClick={() => handleSend(prompt)}
            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-left transition-colors whitespace-nowrap"
        >
            ✨ {label}
        </button>
    );

    return (
        <>
            {/* Floating Trigger */}
            <button 
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 rounded-full shadow-2xl shadow-red-900/40 transition-all hover:scale-105 ${isOpen ? 'w-0 h-0 opacity-0 overflow-hidden' : 'w-14 h-14 bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center text-white'}`}
            >
                <MessageCircleIcon className="w-7 h-7" />
            </button>

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-96 bg-[#151519] border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1c1e20]">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-white">ThumbCopilot</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Context Bar */}
                <div className="bg-[#0b0b0b] px-4 py-2 border-b border-white/5">
                    <p className="text-[10px] uppercase font-bold text-gray-500">
                        Context: {context.step} • {context.mode === 'remix' ? 'Remixing' : 'Scratch'}
                    </p>
                    {context.overlayText && <p className="text-xs text-gray-400 truncate">Hook: "{context.overlayText}"</p>}
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-red-600 text-white' : 'bg-[#2a2b30] text-gray-200'}`}>
                                {msg.content}
                            </div>
                            {/* Suggestions / Action Buttons */}
                            {msg.suggestions && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {msg.suggestions.map((s, i) => (
                                        <button 
                                            key={i}
                                            onClick={s.action}
                                            className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg hover:bg-purple-500/30 transition-colors"
                                        >
                                            Use this
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isTyping && <div className="text-xs text-gray-500 animate-pulse">Thinking...</div>}
                </div>

                {/* Quick Actions & Input */}
                <div className="p-4 border-t border-white/10 bg-[#1c1e20] space-y-3">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {context.step === 'idea' && <QuickAction label="Brainstorm Ideas" prompt="Give me 3 thumbnail concepts" />}
                        {context.step === 'polish' && <QuickAction label="Rewrite Hook" prompt="Make my hook more clickbaity" />}
                        <QuickAction label="Critique" prompt="Critique my current choices" />
                    </div>
                    <div className="relative">
                        <input 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask Copilot..."
                            className="w-full bg-[#0b0b0b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

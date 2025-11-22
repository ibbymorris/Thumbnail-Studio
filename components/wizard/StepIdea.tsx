
import React, { useState, useRef, useEffect } from 'react';
import { WizardMode } from '../../types';
import { ThumbnailShowcase } from './ThumbnailShowcase';
import { 
    Youtube, Mic, Link, Sparkles, ArrowRight, LayoutTemplate, Smile, Type, Image as ImageIcon, Wand2, 
    X, UploadCloud, ScanLine, Search 
} from 'lucide-react';

interface Props {
    mode: WizardMode;
    setMode: (m: WizardMode) => void;
    title: string;
    setTitle: (s: string) => void;
    ideaPrompt: string;
    setIdeaPrompt: React.Dispatch<React.SetStateAction<string>>;
    onUpload: (file: File) => void;
    onNext: () => void;
}

// --- Loading Icons (Visual Only) ---
const LoadingIconWrapper = ({ color, children }: React.PropsWithChildren<{ color: string }>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 256 256" 
        className={`w-10 h-10 ${color}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="256" height="256" stroke="none" fill="none"/>
        {children}
    </svg>
);

const GlobeIcon = () => (
    <LoadingIconWrapper color="text-sky-400">
        <circle cx="128" cy="128" r="96" />
        <path d="M37.61,152H218.39" />
        <path d="M37.61,104H218.39" />
        <path d="M128,224c-23,0-44-43-44-96s21-96,44-96,44,43,44,96S151,224,128,224Z" />
    </LoadingIconWrapper>
);

const ClockIcon = () => (
    <LoadingIconWrapper color="text-purple-400">
        <circle cx="128" cy="128" r="96" />
        <polyline points="128 72 128 128 176 128" />
    </LoadingIconWrapper>
);

const BrainIcon = () => (
     <LoadingIconWrapper color="text-yellow-400">
        <path d="M56,152a48,48,0,0,1,0-96c22,0,41,14.12,46.28,34a56,56,0,1,1,103.44,0c5.3-19.88,24.26-34,46.28-34a48,48,0,0,1,0,96" />
        <path d="M160,216a48,48,0,0,0,0-96H96a48,48,0,0,0,0,96" />
        <line x1="96" y1="120" x2="160" y2="120" />
        <line x1="128" y1="160" x2="128" y2="216" />
    </LoadingIconWrapper>
);

const DatabaseIcon = () => (
    <LoadingIconWrapper color="text-orange-400">
        <ellipse cx="128" cy="80" rx="88" ry="48" />
        <path d="M40,80v48c0,26.51,39.4,48,88,48s88-21.49,88-48V80" />
        <path d="M40,128v48c0,26.51,39.4,48,88,48s88-21.49,88-48V128" />
    </LoadingIconWrapper>
);

const PaletteIcon = () => (
    <LoadingIconWrapper color="text-pink-400">
        <circle cx="134" cy="130" r="14" fill="currentColor" stroke="none" />
        <circle cx="86" cy="118" r="14" fill="currentColor" stroke="none" />
        <circle cx="126" cy="86" r="14" fill="currentColor" stroke="none" />
        <path d="M224.09,110.57c-5.83-42.88-44.67-78.41-91.91-78.57-51.64-.17-94,42.28-94,94s42.36,94.17,94,94a53.91,53.91,0,0,0,47.92-28.6,12,12,0,0,0-3.6-14.84l-17.7-13.36A22,22,0,1,1,180,128a6,6,0,0,0,6-6C186,115.85,219.43,112.53,224.09,110.57Z" />
    </LoadingIconWrapper>
);

const LayoutIcon = () => (
    <LoadingIconWrapper color="text-emerald-400">
        <rect x="32" y="48" width="192" height="160" rx="8" />
        <line x1="104" y1="48" x2="104" y2="208" />
        <line x1="104" y1="128" x2="224" y2="128" />
    </LoadingIconWrapper>
);

// --- Helper Components ---

const BlueprintCard = ({ icon: Icon, label, value, color, delay }: any) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    if (!isVisible) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                    <Icon size={14} />
                    {label}
                </div>
                <button className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
            </div>
            <div className={`text-lg font-medium ${color}`}>
                {value}
            </div>
        </div>
    );
};

export const StepIdea = ({ mode, setMode, title, setTitle, ideaPrompt, setIdeaPrompt, onUpload, onNext }: Props) => {
    const [chatState, setChatState] = useState<'empty' | 'analyzing' | 'ready'>('empty');
    const [blueprintData, setBlueprintData] = useState<any>(null);
    const [showChannel, setShowChannel] = useState(true);
    
    // Remix State
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [remixUrlInput, setRemixUrlInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Typewriter Effect
    const [placeholder, setPlaceholder] = useState('');
    const [conceptIndex, setConceptIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const concepts = [
        "MrBeast style challenge: Last to leave circle wins $10,000...",
        "Tech review: Is the Vision Pro actually worth it?",
        "Gaming: I found the rarest item in Minecraft Hardcore...",
        "Vlog: A day in the life of a software engineer in NYC..."
    ];

    useEffect(() => {
        const typeSpeed = 50;
        const deleteSpeed = 30;
        const pauseDuration = 2000;

        let timeout: ReturnType<typeof setTimeout>;

        if (isPaused) {
            timeout = setTimeout(() => {
                setIsPaused(false);
                if (!isDeleting) {
                    setIsDeleting(true);
                } else {
                    setIsDeleting(false);
                    setConceptIndex((prev) => (prev + 1) % concepts.length);
                }
            }, isDeleting ? 500 : pauseDuration); 
            return () => clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            const currentConcept = concepts[conceptIndex];
            if (isDeleting) {
                setPlaceholder(currentConcept.substring(0, charIndex - 1));
                setCharIndex(prev => prev - 1);
                if (charIndex <= 1) setIsPaused(true);
            } else {
                setPlaceholder(currentConcept.substring(0, charIndex + 1));
                setCharIndex(prev => prev + 1);
                if (charIndex >= currentConcept.length) setIsPaused(true);
            }
        }, isDeleting ? deleteSpeed : typeSpeed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, isPaused, conceptIndex]);

    const handleSimulate = () => {
        const text = "I tried the Vision Pro for a week. It's technically amazing but way too expensive. I'm actually kinda angry about the price.";
        let i = 0;
        setIdeaPrompt("");
        
        const interval = setInterval(() => {
            setIdeaPrompt(text.substring(0, i));
            i++;
            if (i > text.length) {
                clearInterval(interval);
                // Auto submit after typing
                setTimeout(() => handleSubmit(text), 400);
            }
        }, 30);
    };

    const handleSubmit = (text: string) => {
        if (!text) return;
        setChatState("analyzing");
        setTimeout(() => {
            setChatState("ready");
            setBlueprintData({
                type: "Tech Review",
                emotion: "Conflicted / Shocked",
                hook: "IS IT WORTH IT?",
                elements: "Review Unit, Price Tag Overlay"
            });
        }, 1500);
    };

    const handleRemixUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setUploadedImage(url);
            onUpload(file);
        }
    };

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleRemixGrab = async () => {
        const id = getYoutubeId(remixUrlInput);
        if (id) {
            const url = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
            setUploadedImage(url);
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const file = new File([blob], "youtube-thumbnail.jpg", { type: "image/jpeg" });
                onUpload(file);
            } catch (e) {
                const file = new File([""], "youtube-thumbnail.jpg", { type: "image/jpeg" });
                Object.assign(file, { preview: url });
                onUpload(file); 
            }
        }
    };

    return (
        <div className="relative w-full min-h-[600px]">
            {/* Background */}
            <div className="absolute inset-0 -mx-6 -my-6 overflow-hidden pointer-events-none z-0">
                 <ThumbnailShowcase />
            </div>

            {/* Styles for animations */}
            <style>{`
                .glow-input:focus-within {
                    box-shadow: 0 0 20px rgba(220, 38, 38, 0.15);
                    border-color: rgba(220, 38, 38, 0.5);
                }
                @keyframes shimmer {
                    0% { background-position: 100% center; }
                    100% { background-position: -100% center; }
                }
                @keyframes shimmer-btn {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes bounceSequence {
                    0% { opacity: 0; transform: scale(0); }
                    15% { opacity: 1; transform: scale(1.2); }
                    25% { transform: scale(1); }
                    85% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0); }
                }
                .glass-panel {
                    background: rgba(20, 20, 20, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }
            `}</style>

            <div className="relative z-10 w-full flex flex-col items-center pt-6">
                
                {/* Mode Toggle */}
                <div className="bg-[#0F0F0F] p-1 rounded-full flex border border-white/10 mb-6 shadow-2xl">
                    <button 
                        onClick={() => setMode("fromScratch")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === "fromScratch" ? "bg-[#252525] text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
                    >
                        From Scratch
                    </button>
                    <button 
                        onClick={() => setMode("remix")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === "remix" ? "bg-[#252525] text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
                    >
                        Remix (New)
                    </button>
                </div>

                {mode === 'fromScratch' ? (
                    <div className="max-w-3xl w-full flex flex-col gap-6 animate-in fade-in duration-300">
                        <div className={`transition-all duration-500 w-full text-center ${chatState !== 'empty' ? 'hidden' : 'block'}`}>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-200 mb-4 leading-tight font-['Space_Grotesk']">
                                What are we <br />making today?
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Just describe your video, script, or idea. <br className="hidden md:block"/>
                                I'll handle the structure.
                            </p>
                        </div>

                        <div className="relative z-10 w-full">
                            {/* Channel Connected Pill */}
                            <div className={`absolute -top-10 left-0 transition-all duration-300 ${chatState !== 'empty' ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
                                <button 
                                    onClick={() => setShowChannel(!showChannel)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${showChannel ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'bg-[#151515] border-white/10 text-gray-500'}`}
                                >
                                    <Youtube size={12} />
                                    {showChannel ? "Connected: TechReviewsDaily" : "Connect Channel"}
                                </button>
                            </div>

                            {/* Chat Input Area */}
                            <div className={`glass-panel rounded-2xl p-4 transition-all duration-500 glow-input relative overflow-hidden ${chatState !== 'empty' ? 'border-white/10' : ''}`}>
                                {chatState === 'ready' ? (
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-400 italic text-sm truncate pr-4">"{ideaPrompt || "Remix Analysis Complete"}"</p>
                                        <button onClick={() => {setChatState('empty'); setBlueprintData(null); setIdeaPrompt('');}} className="text-xs text-red-400 hover:text-red-300 font-medium">Start Over</button>
                                    </div>
                                ) : (
                                    <>
                                        <textarea
                                            value={ideaPrompt}
                                            onChange={(e) => setIdeaPrompt(e.target.value)}
                                            placeholder={placeholder}
                                            className="w-full bg-transparent border-none outline-none text-lg resize-none h-32 placeholder-gray-600 text-gray-100"
                                            disabled={chatState === 'analyzing'}
                                        />
                                        
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                            <div className="flex gap-2">
                                                <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition" title="Add Link"><Link size={18} /></button>
                                                <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition" title="Voice Input"><Mic size={18} /></button>
                                                <button 
                                                    onClick={handleSimulate}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-blue-300 transition ml-2"
                                                >
                                                    <Sparkles size={12} /> 
                                                    Auto-fill Example
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => handleSubmit(ideaPrompt)}
                                                disabled={!ideaPrompt}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${ideaPrompt ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20' : 'bg-[#252525] text-gray-600 cursor-not-allowed'}`}
                                            >
                                                <ArrowRight size={20} />
                                            </button>
                                        </div>
                                    </>
                                )}
                                
                                {chatState === 'analyzing' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-1/2 h-full -skew-x-12 animate-[shimmer_1s_infinite] pointer-events-none"></div>
                                )}
                            </div>
                            
                            {chatState === 'empty' && (
                                <div className="flex flex-wrap justify-center gap-2 mt-4">
                                    <span className="text-xs text-gray-500 py-1 mr-2">Start with:</span>
                                    {["Gaming Highlight", "Vlog", "Tutorial", "Podcast Clip"].map(tag => (
                                        <button key={tag} onClick={() => setIdeaPrompt(prev => prev + tag + " ")} className="px-3 py-1 rounded-full bg-[#151515] border border-white/5 text-xs text-gray-400 hover:text-white hover:border-white/20 transition">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Blueprint Result */}
                        {chatState === 'ready' && (
                            <div className="flex flex-col gap-6 w-full animate-in slide-in-from-bottom-4 duration-700">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 mt-1">
                                        <Wand2 size={14} className="text-white" />
                                    </div>
                                    <div className="bg-[#151515] rounded-r-xl rounded-bl-xl p-4 text-gray-300 leading-relaxed text-sm border border-white/5 w-full">
                                        <p className="mb-2">Analysis Complete. I've broken down the visual structure of your concept and prepared a Blueprint.</p>
                                        <p className="text-gray-400 text-xs">Here is the Blueprint I've constructed:</p>
                                    </div>
                                </div>

                                {blueprintData && (
                                    <div className="ml-12 pl-4 border-l-2 border-white/10 flex flex-col gap-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase flex items-center gap-2">
                                                <LayoutTemplate size={12}/> Blueprint Generated
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <BlueprintCard 
                                                icon={LayoutTemplate} 
                                                label="Video Type" 
                                                value={blueprintData.type} 
                                                color="text-white" 
                                                delay={100}
                                            />
                                            <BlueprintCard 
                                                icon={Smile} 
                                                label="Emotion / Vibe" 
                                                value={blueprintData.emotion} 
                                                color="text-red-400" 
                                                delay={200}
                                            />
                                            <BlueprintCard 
                                                icon={Type} 
                                                label="Hook Suggestion" 
                                                value={`"${blueprintData.hook}"`} 
                                                color="text-yellow-100 font-serif italic" 
                                                delay={300}
                                            />
                                            <BlueprintCard 
                                                icon={ImageIcon} 
                                                label="Key Elements" 
                                                value={blueprintData.elements} 
                                                color="text-gray-300 text-sm" 
                                                delay={400}
                                            />
                                        </div>

                                        <div className="pt-4 flex gap-3 animate-in fade-in" style={{animationDelay: '600ms'}}>
                                            <button onClick={onNext} className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white shadow-xl shadow-red-900/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                                                <Sparkles size={18} />
                                                Generate 3 Concepts
                                            </button>
                                            <button onClick={onNext} className="px-6 py-3 bg-[#252525] hover:bg-[#333] rounded-xl text-sm font-medium text-gray-300 border border-white/5 transition-all">
                                                Manual Tweak
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    // REMIX MODE
                    <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-300 max-w-3xl pb-20">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-200 mb-4 leading-tight font-['Space_Grotesk']">
                                What are we <br />making today?
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Analyze any viral thumbnail and remix it with your own style.
                            </p>
                        </div>

                        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 w-full shadow-2xl relative overflow-hidden glass-panel">
                            {!uploadedImage ? (
                                <div className="flex flex-col gap-6 relative z-10">
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg flex items-center px-4 focus-within:border-white/30 transition-colors h-12">
                                            <Search size={18} className="text-gray-500 mr-3" />
                                            <input 
                                                type="text" 
                                                placeholder="Paste YouTube Video URL here..." 
                                                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500 h-full"
                                                value={remixUrlInput}
                                                onChange={(e) => setRemixUrlInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleRemixGrab()}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleRemixGrab}
                                            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 rounded-lg transition-colors text-sm h-12"
                                        >
                                            Grab
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="h-px bg-white/10 flex-1"></div>
                                        <span className="text-xs text-gray-500 font-medium tracking-wide">OR UPLOAD</span>
                                        <div className="h-px bg-white/10 flex-1"></div>
                                    </div>

                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-white/10 rounded-xl h-40 flex flex-col items-center justify-center gap-3 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer group"
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleRemixUpload}
                                        />
                                        <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                            <UploadCloud size={20} />
                                        </div>
                                        <span className="text-gray-500 text-sm group-hover:text-gray-300 transition-colors">Click or drop image here</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video group">
                                    <button 
                                        onClick={() => setUploadedImage(null)}
                                        className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-30"
                                    >
                                        <X size={16} />
                                    </button>

                                    <div className="absolute bottom-3 left-3 bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 z-20">
                                        <ScanLine size={14} className="text-green-400" />
                                        <span className="text-xs font-medium text-white">Ready to Remix</span>
                                    </div>

                                    <img 
                                        src={uploadedImage} 
                                        alt="Uploaded thumbnail" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {!uploadedImage ? (
                                <div className="mt-6 bg-[#1A1A1A] border border-white/5 rounded-xl p-4 flex items-center gap-4 opacity-60">
                                        <div className="w-10 h-10 rounded-lg bg-[#2D2645] flex items-center justify-center shrink-0">
                                        <ScanLine size={20} className="text-gray-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 font-semibold text-sm">Ready to Deconstruct</span>
                                        <span className="text-gray-600 text-xs">Upload a thumbnail to decode its secrets.</span>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={onNext}
                                    className="w-full mt-6 bg-gradient-to-r from-[#2D2645] to-[#161425] hover:from-[#3b325e] hover:to-[#211e38] border border-[#A78BFA]/30 hover:border-[#A78BFA]/60 rounded-xl p-4 flex items-center justify-between group transition-all cursor-pointer shadow-lg shadow-purple-900/10 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shimmer-btn_2s_infinite]" style={{backgroundSize: '200% 100%'}}></div>
                                    
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-10 h-10 rounded-lg bg-[#A78BFA] text-[#1E1B2E] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(167,139,250,0.5)]">
                                            <Sparkles size={20} className="animate-pulse" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[#A78BFA] font-bold text-sm group-hover:text-white transition-colors">Make This Viral Hit Yours</span>
                                            <span className="text-gray-400 text-xs group-hover:text-gray-300">We'll auto-separate the Subject, Props, and Background so you can swap pieces without wrecking the layout.</span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors relative z-10">
                                        <ArrowRight size={16} className="text-white" />
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

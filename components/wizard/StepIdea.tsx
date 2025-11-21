
import React, { useState, useRef, useEffect } from 'react';
import { WizardMode, FileWithPreview } from '../../types';
import { Card } from '../ui/Shared';
import { UploadIcon, MagicIcon, SearchIcon, XIcon, ImageDownIcon } from '../icons';
import { ThumbnailShowcase } from './ThumbnailShowcase';

interface Props {
    mode: WizardMode;
    setMode: (m: WizardMode) => void;
    title: string;
    setTitle: (s: string) => void;
    ideaPrompt: string;
    setIdeaPrompt: (s: string) => void;
    onUpload: (file: File) => void;
}

export const StepIdea = ({ mode, setMode, title, setTitle, ideaPrompt, setIdeaPrompt, onUpload }: Props) => {
    const [youtubeLink, setYoutubeLink] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Typewriter Effect State
    const [placeholder, setPlaceholder] = useState('');
    const [conceptIndex, setConceptIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const concepts = [
        "MrBeast style challenge: Last to leave circle wins $10,000...",
        "Tech review: Is the Vision Pro actually worth it?",
        "Gaming: I found the rarest item in Minecraft Hardcore...",
        "Vlog: A day in the life of a software engineer in NYC...",
        "Cooking: How to make the perfect Gordon Ramsay steak..."
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
            }, isDeleting ? 500 : pauseDuration); // Short pause before deleting, long pause after typing
            return () => clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            const currentConcept = concepts[conceptIndex];
            
            if (isDeleting) {
                setPlaceholder(currentConcept.substring(0, charIndex - 1));
                setCharIndex(prev => prev - 1);
                if (charIndex <= 1) {
                    setIsPaused(true);
                }
            } else {
                setPlaceholder(currentConcept.substring(0, charIndex + 1));
                setCharIndex(prev => prev + 1);
                if (charIndex >= currentConcept.length) {
                    setIsPaused(true);
                }
            }
        }, isDeleting ? deleteSpeed : typeSpeed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, isPaused, conceptIndex]);


    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleGrabUrl = async () => {
        const id = getYoutubeId(youtubeLink);
        if (id) {
            const url = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
            setPreviewUrl(url);
            
            // Convert URL to a File object for the parent handler
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const file = new File([blob], "youtube-thumbnail.jpg", { type: "image/jpeg" });
                onUpload(file);
            } catch (e) {
                // Fallback for CORS issues in demo: create a dummy file with preview property
                // In production, this would be handled by a proxy
                const file = new File([""], "youtube-thumbnail.jpg", { type: "image/jpeg" });
                Object.assign(file, { preview: url });
                onUpload(file); 
            }
        }
    };

    const handleFileUpload = (file: File) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onUpload(file);
        }
    };

    const clearPreview = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        setYoutubeLink('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="relative w-full min-h-[600px]">
            {/* Background Showcase */}
            <div className="absolute inset-0 -mx-6 -my-6 overflow-hidden pointer-events-none z-0">
                 <ThumbnailShowcase />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold font-['Space_Grotesk'] drop-shadow-lg">What are we making?</h2>
                    <p className="text-gray-300 drop-shadow-md">Start from scratch or remix an existing hit.</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-[#1c1e20]/80 backdrop-blur p-1 rounded-xl border border-white/10 w-fit mx-auto shadow-xl">
                    <button 
                        onClick={() => setMode('fromScratch')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'fromScratch' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    >
                        From Scratch
                    </button>
                    <button 
                        onClick={() => setMode('remix')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'remix' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    >
                        Remix (New)
                    </button>
                </div>

                <Card className="shadow-2xl border-white/20 bg-[#1c1e20]/95 backdrop-blur-sm">
                    {mode === 'fromScratch' ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Thumbnail Concept</label>
                                <textarea 
                                    value={ideaPrompt}
                                    onChange={(e) => setIdeaPrompt(e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full h-32 bg-black border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:border-red-500 outline-none placeholder-gray-500 transition-all"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {!previewUrl ? (
                                <>
                                    {/* URL Grabber */}
                                    <div className="bg-[#151618] border border-[#ffffff1a] rounded-xl p-1.5 flex gap-2 shadow-inner">
                                        <div className="flex-grow relative">
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <SearchIcon className="size-5 text-gray-500" />
                                            </div>
                                            <input 
                                                type="text" 
                                                value={youtubeLink}
                                                onChange={(e) => setYoutubeLink(e.target.value)}
                                                placeholder="Paste YouTube Video URL here..."
                                                className="w-full h-12 bg-transparent pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none"
                                                onKeyDown={(e) => e.key === 'Enter' && handleGrabUrl()}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleGrabUrl}
                                            className="bg-[#ff0000] hover:bg-red-600 text-white font-bold px-6 rounded-lg transition-colors"
                                        >
                                            Grab
                                        </button>
                                    </div>

                                    <div className="relative flex py-2 items-center">
                                        <div className="flex-grow border-t border-white/10"></div>
                                        <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase font-bold">Or Upload</span>
                                        <div className="flex-grow border-t border-white/10"></div>
                                    </div>

                                    {/* File Upload */}
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-white/10 rounded-xl h-32 flex flex-col items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer relative group"
                                    >
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            className="hidden"
                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                            accept="image/*"
                                        />
                                        <div className="w-12 h-12 bg-[#1c1e20] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <UploadIcon className="w-6 h-6 text-gray-500 group-hover:text-white"/>
                                        </div>
                                        <span className="text-sm text-gray-400 font-medium">Click or drop image here</span>
                                    </div>
                                </>
                            ) : (
                                /* Preview State */
                                <div className="animate-in zoom-in duration-300">
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Remix Source" />
                                        
                                        {/* Overlays */}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                        
                                        <div className="absolute top-4 right-4">
                                            <button 
                                                onClick={clearPreview}
                                                className="bg-black/50 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur transition-colors"
                                            >
                                                <XIcon className="size-4" />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                                                <ImageDownIcon className="size-3" /> Ready to Remix
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl flex items-start gap-3">
                                <MagicIcon className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-gray-400">
                                    <span className="font-bold text-purple-300 block mb-1">AI Analysis</span>
                                    Click "Next" to detect subjects, props, and text automatically.
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

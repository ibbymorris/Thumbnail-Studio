
import React from 'react';
import { WizardMode, RemixAnalysis, AspectRatio, VariantStrategy, BrandKit } from '../../types';
import { Card, Badge } from '../ui/Shared';
import { TextIcon, CheckIcon, SparklesIcon, PaletteIcon, FaceIcon, ImageIcon, MagicIcon, TrendingIcon } from '../icons';

interface Props {
    mode: WizardMode;
    overlayText: string;
    setOverlayText: (t: string) => void;
    remixAnalysis?: RemixAnalysis | null;
    aspectRatio: AspectRatio;
    setAspectRatio: (a: AspectRatio) => void;
    variantStrategy: VariantStrategy;
    setVariantStrategy: (s: VariantStrategy) => void;
    generateShorts: boolean;
    setGenerateShorts: (b: boolean) => void;
    style: string;
    setStyle: (s: string) => void;
    useBrandColors: boolean;
    setUseBrandColors: (b: boolean) => void;
    brandKit: BrandKit;
    setBrandKit: (b: BrandKit) => void;
}

const hookSuggestions = [
    "IT’S NOT WHAT I EXPECTED",
    "DO NOT BUY THIS YET",
    "THIS ONE THING RUINS IT",
    "TOTALLY WORTH IT?",
    "I WAS WRONG"
];

const thumbnailStyles = [
    { id: 'Modern and Viral', label: 'Viral', desc: 'High saturation, bold text, MrBeast style' },
    { id: 'Cinematic Dark', label: 'Cinematic', desc: 'Dramatic lighting, shadows, film grain' },
    { id: 'Minimalist Tech', label: 'Tech', desc: 'Clean white/grey background, product focus' },
    { id: 'Gaming Action', label: 'Gaming', desc: 'Neon accents, speed lines, intense contrast' },
    { id: 'Vlog Natural', label: 'Vlog', desc: 'Bright, natural lighting, candid expression' },
];

const CTRChecklist = ({ text }: { text: string }) => {
    const wordCount = text.split(' ').filter(w => w.length > 0).length;
    const isShort = wordCount <= 4;
    const hasContent = wordCount > 0;
    
    return (
        <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl max-w-[180px]">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <TrendingIcon className="size-3 text-green-400" /> CTR Checklist
            </div>
            <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckIcon className="size-3" /> 
                    <span>Face is large (>30%)</span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${hasContent ? 'text-green-400' : 'text-gray-500'}`}>
                    <CheckIcon className="size-3" /> 
                    <span>High Contrast</span>
                </div>
                 <div className={`flex items-center gap-2 text-xs ${isShort ? 'text-green-400' : 'text-yellow-500'}`}>
                    <CheckIcon className="size-3" /> 
                    <span>Text ≤ 4 words</span>
                </div>
                 <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckIcon className="size-3" /> 
                    <span>Single Idea</span>
                </div>
            </div>
        </div>
    );
}

export const StepPolish = ({ 
    mode, overlayText, setOverlayText, remixAnalysis, aspectRatio, setAspectRatio,
    variantStrategy, setVariantStrategy, generateShorts, setGenerateShorts,
    style, setStyle, useBrandColors, setUseBrandColors, brandKit, setBrandKit
}: Props) => {
    
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold font-['Space_Grotesk']">Final Polish</h2>
                <p className="text-gray-400">Thumbnails ready in 3 variants.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Preview */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                         <h3 className="font-bold text-white text-sm uppercase tracking-wider">Main Preview</h3>
                         <span className="text-xs text-gray-500">16:9 HD</span>
                    </div>
                    
                    <div className={`bg-[#050505] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group aspect-video shadow-2xl`}>
                        {mode === 'remix' && remixAnalysis ? (
                            <img src={remixAnalysis.originalUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" alt="orig" />
                        ) : (
                             <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
                        )}
                        
                        {/* Mock Content for Context */}
                        <div className="z-10 text-center px-6 transform group-hover:scale-105 transition-transform duration-500">
                            <span className="block text-5xl md:text-6xl font-black text-white uppercase drop-shadow-2xl tracking-tighter leading-[0.9]" style={{ textShadow: '0 10px 30px rgba(0,0,0,1)' }}>
                                {overlayText || "YOUR TEXT"}
                            </span>
                        </div>

                        {/* Checklist Overlay */}
                        <CTRChecklist text={overlayText} />
                    </div>

                    {/* Style Selection */}
                    <Card className="p-4 bg-[#1c1e20] border-white/10">
                         <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Visual Style</label>
                         <div className="grid grid-cols-3 gap-2">
                             {thumbnailStyles.map(s => (
                                 <button 
                                    key={s.id}
                                    onClick={() => setStyle(s.id)}
                                    className={`text-left p-2 rounded-lg border transition-all group relative ${style === s.id ? 'bg-white/10 border-red-500 text-white' : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'}`}
                                 >
                                     <div className="text-xs font-bold mb-0.5">{s.label}</div>
                                     
                                     {/* Micro-description tooltip on hover */}
                                     <div className="hidden group-hover:block absolute bottom-full left-0 w-40 bg-black border border-white/10 p-2 rounded-lg text-[10px] text-gray-300 z-20 mb-2 shadow-xl">
                                         {s.desc}
                                     </div>
                                 </button>
                             ))}
                         </div>
                    </Card>
                </div>

                {/* Right Column: Controls */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* 1. Hook Section */}
                    <Card className="space-y-4 bg-[#1c1e20]/80 backdrop-blur-sm">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block flex justify-between">
                                <span>Viral Hook (Text Overlay)</span>
                                <span className="text-xs text-gray-600">{overlayText.length}/25 chars</span>
                            </label>
                            
                            <div className="relative mb-3">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <TextIcon className="size-5 text-gray-500" />
                                </div>
                                <input 
                                    type="text" 
                                    value={overlayText}
                                    onChange={(e) => setOverlayText(e.target.value)}
                                    placeholder="e.g. I SURVIVED!"
                                    className="w-full bg-[#0b0b0b] border border-[#ffffff0d] rounded-xl pl-12 pr-4 py-4 text-xl font-bold text-white placeholder-gray-700 focus:border-[#ff0000] outline-none uppercase tracking-widest transition-all"
                                />
                            </div>

                            {/* Chips */}
                            <div className="flex flex-wrap gap-2">
                                {hookSuggestions.map(hook => (
                                    <button 
                                        key={hook}
                                        onClick={() => setOverlayText(hook)}
                                        className="text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-lg px-3 py-1.5 text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                                    >
                                        {hook}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Brand Kit - New Section */}
                    <Card className="bg-[#1c1e20]/80 backdrop-blur-sm">
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="p-2 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-white/10">
                                     <PaletteIcon className="size-4 text-purple-400" />
                                 </div>
                                 <div>
                                     <h3 className="text-xs font-bold text-gray-200 uppercase">Brand Kit</h3>
                                     <div className="flex items-center gap-2 mt-0.5">
                                         <span className="w-2 h-2 rounded-full shadow-[0_0_4px_rgba(0,0,0,0.5)]" style={{ backgroundColor: brandKit.primaryColor }}></span>
                                         <span className="text-[10px] text-gray-500">{brandKit.primaryColor} • {brandKit.fontStyle}</span>
                                     </div>
                                 </div>
                             </div>
                             <div className="flex items-center gap-2">
                                 <span className={`text-xs font-bold transition-colors ${useBrandColors ? 'text-white' : 'text-gray-600'}`}>
                                     {useBrandColors ? 'Colors Applied' : 'Apply Colors'}
                                 </span>
                                 <button 
                                     onClick={() => setUseBrandColors(!useBrandColors)}
                                     className={`w-9 h-5 rounded-full transition-colors relative ${useBrandColors ? 'bg-purple-600' : 'bg-gray-700'}`}
                                 >
                                     <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${useBrandColors ? 'left-5' : 'left-1'}`}></div>
                                 </button>
                             </div>
                         </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* 2. Output Format */}
                        <Card className="bg-[#1c1e20]/80 backdrop-blur-sm h-full">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-4 block">Platform Formats</label>
                            <div className="space-y-3">
                                <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all bg-[#0b0b0b] border-green-500/30`}>
                                    <div className="w-8 h-5 bg-gray-800 rounded border border-gray-600 flex items-center justify-center text-[8px] text-gray-400">16:9</div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-bold text-white">YouTube Thumbnail</div>
                                        <div className="text-[10px] text-gray-500">Standard • 1280x720</div>
                                    </div>
                                    <CheckIcon className="size-4 text-green-500" />
                                </div>

                                <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${generateShorts ? 'bg-[#0b0b0b] border-[#ff0000]' : 'bg-transparent border-white/5 hover:bg-white/5'}`}>
                                    <div className="w-5 h-8 bg-gray-800 rounded border border-gray-600 flex items-center justify-center text-[8px] text-gray-400">9:16</div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-bold text-white">Shorts Cover</div>
                                        <div className="text-[10px] text-gray-500">Vertical • 1080x1920</div>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={generateShorts}
                                        onChange={(e) => setGenerateShorts(e.target.checked)}
                                        className="accent-[#ff0000] size-4" 
                                    />
                                </label>
                            </div>
                        </Card>

                        {/* 3. A/B Variants */}
                        <Card className="bg-[#1c1e20]/80 backdrop-blur-sm h-full">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-xs font-bold text-gray-500 uppercase block">A/B Testing</label>
                                {variantStrategy !== 'none' && <Badge variant="accent">3 Variants</Badge>}
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer mb-3">
                                    <input 
                                        type="checkbox" 
                                        checked={variantStrategy !== 'none'}
                                        onChange={(e) => setVariantStrategy(e.target.checked ? 'mix' : 'none')}
                                        className="accent-[#ff0000] size-4"
                                    />
                                    <span className="text-sm font-bold text-white">Generate 3 Variants</span>
                                </label>

                                <div className={`space-y-2 transition-all overflow-hidden ${variantStrategy !== 'none' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                    
                                    <div className="grid grid-cols-1 gap-2">
                                        <label className={`text-[10px] p-2 rounded border text-left flex items-center gap-2 cursor-pointer transition-colors ${variantStrategy === 'emotion' ? 'bg-white/10 border-[#ff0000] text-white' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                                            <input type="radio" name="varStrat" checked={variantStrategy === 'emotion'} onChange={() => setVariantStrategy('emotion')} className="hidden" />
                                            <FaceIcon className="size-3" /> Change Emotion Only
                                        </label>
                                        <label className={`text-[10px] p-2 rounded border text-left flex items-center gap-2 cursor-pointer transition-colors ${variantStrategy === 'background' ? 'bg-white/10 border-[#ff0000] text-white' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                                            <input type="radio" name="varStrat" checked={variantStrategy === 'background'} onChange={() => setVariantStrategy('background')} className="hidden" />
                                            <ImageIcon className="size-3" /> Change Background Only
                                        </label>
                                        <label className={`text-[10px] p-2 rounded border text-left flex items-center gap-2 cursor-pointer transition-colors ${variantStrategy === 'color' ? 'bg-white/10 border-[#ff0000] text-white' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                                            <input type="radio" name="varStrat" checked={variantStrategy === 'color'} onChange={() => setVariantStrategy('color')} className="hidden" />
                                            <PaletteIcon className="size-3" /> Change Colors Only
                                        </label>
                                        <label className={`text-[10px] p-2 rounded border text-left flex items-center gap-2 cursor-pointer transition-colors ${variantStrategy === 'mix' ? 'bg-white/10 border-[#ff0000] text-white' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                                            <input type="radio" name="varStrat" checked={variantStrategy === 'mix'} onChange={() => setVariantStrategy('mix')} className="hidden" />
                                            <MagicIcon className="size-3" /> Mix Everything
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

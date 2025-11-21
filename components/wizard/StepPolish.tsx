
import React from 'react';
import { WizardMode, RemixAnalysis, ThumbnailStyle, AspectRatio } from '../../types';
import { Card, Badge } from '../ui/Shared';
import { TextIcon } from '../icons';

interface Props {
    mode: WizardMode;
    overlayText: string;
    setOverlayText: (t: string) => void;
    remixAnalysis?: RemixAnalysis | null;
    selectedStyle: ThumbnailStyle;
    setSelectedStyle: (s: ThumbnailStyle) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (a: AspectRatio) => void;
    stylePresets: any[];
}

export const StepPolish = ({ mode, overlayText, setOverlayText, remixAnalysis, selectedStyle, setSelectedStyle, aspectRatio, setAspectRatio, stylePresets }: Props) => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold font-['Space_Grotesk']">Final Polish</h2>
                <p className="text-gray-400">Review and generate.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-white">Preview</h3>
                    <div className={`bg-black border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden ${aspectRatio === '9:16' ? 'aspect-[9/16] max-w-xs mx-auto' : 'aspect-video'}`}>
                        {mode === 'remix' && remixAnalysis ? (
                            <img src={remixAnalysis.originalUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" alt="orig" />
                        ) : (
                             <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                        )}
                        <div className="z-10 text-center px-6">
                            <span className="block text-4xl md:text-5xl font-black text-white uppercase drop-shadow-2xl tracking-tighter leading-tight" style={{ textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>{overlayText || "YOUR TEXT"}</span>
                            <span className="text-xs text-gray-400 mt-4 block border border-gray-700 rounded-full px-3 py-1 w-fit mx-auto bg-black/50 backdrop-blur">(Draft Preview)</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Overlay Text (Hook)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <TextIcon className="size-5 text-gray-500" />
                                </div>
                                <input 
                                    type="text" 
                                    value={overlayText}
                                    onChange={(e) => setOverlayText(e.target.value)}
                                    placeholder="e.g. I SURVIVED!"
                                    className="w-full bg-[#0b0b0b] border border-[#ffffff0d] rounded-xl pl-12 pr-4 py-4 text-xl font-bold text-white placeholder-gray-700 focus:border-[#ff0000] outline-none uppercase tracking-widest"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Visual Style</label>
                            <div className="grid grid-cols-4 gap-3">
                                {stylePresets.slice(0,4).map((style: any) => (
                                    <button 
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${selectedStyle === style.id ? 'border-[#ff0000] scale-105 shadow-lg shadow-red-900/20' : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'}`}
                                    >
                                        <img src={style.imageUrl} className="w-full h-full object-cover" alt={style.title} />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[10px] font-bold text-center text-white truncate">{style.title}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Format</label>
                            <div className="flex bg-[#0b0b0b] p-1 rounded-xl border border-[#ffffff0d]">
                                <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${aspectRatio === '16:9' ? 'bg-[#1c1e20] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}>16:9</button>
                                <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${aspectRatio === '9:16' ? 'bg-[#1c1e20] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}>9:16</button>
                            </div>
                        </div>

                        <div>
                             <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <input type="checkbox" className="accent-red-600 size-4" /> 
                                <span>Generate 3 A/B Variants</span>
                                <Badge variant="accent">Recommended</Badge>
                             </label>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

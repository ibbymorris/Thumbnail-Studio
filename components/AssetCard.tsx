
import React, { useState } from 'react';
import { FileWithPreview } from '../types';
import { PlusIcon, MagicWandIcon, StarIcon } from './icons';
import { base64ToBlob, generateAsset } from '../services/geminiService';

const backgroundStyles = [
    { id: 'high-contrast', label: 'Dramatic', promptMod: 'High contrast, dramatic lighting, dark background, cinematic' },
    { id: 'gradient', label: 'Gradient', promptMod: 'Vibrant smooth color gradient, modern abstract, 4k' },
    { id: 'textured', label: 'Textured', promptMod: 'Detailed grunge texture, subtle pattern, professional background' },
    { id: 'office', label: 'Studio', promptMod: 'Blurred modern studio background, bokeh, depth of field' },
    { id: 'outdoor', label: 'Outdoor', promptMod: 'Outdoor city street or nature, bright natural lighting, blurred background' },
];

interface AssetCardProps {
    type: 'subject' | 'prop' | 'background';
    title: string;
    description?: string;
    icon: React.ReactNode;
    mode: 'upload' | 'generate';
    setMode: (m: 'upload' | 'generate') => void;
    image: FileWithPreview | null;
    setImage: (f: FileWithPreview | null) => void;
    genPrompt: string;
    setGenPrompt: (s: string) => void;
    placeholderUrl: string;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isRemix?: boolean;
}

export const AssetCard = ({ type, title, description, icon, mode, setMode, image, setImage, genPrompt, setGenPrompt, placeholderUrl, fileInputRef, handleFile, isRemix }: AssetCardProps) => {
    const [previews, setPreviews] = useState<string[]>([]);
    const [isGeneratingPreviews, setIsGeneratingPreviews] = useState(false);
    const [selectedBgStyle, setSelectedBgStyle] = useState(backgroundStyles[0]);

    const handleGeneratePreviews = async () => {
        if (!window.aistudio) return;
        try {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) await window.aistudio.openSelectKey();
        } catch { return; }

        setIsGeneratingPreviews(true);
        setPreviews([]);
        try {
            let promptToUse = genPrompt;
            if (type === 'background') {
                promptToUse = `${genPrompt} style: ${selectedBgStyle.promptMod}`;
            }
            const promises = [1, 2, 3].map(() => generateAsset(promptToUse, type));
            const results = await Promise.all(promises);
            setPreviews(results);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGeneratingPreviews(false);
        }
    }

    const handleSelectPreview = (base64: string) => {
        const blob = base64ToBlob(base64);
        const file = new File([blob], `generated-${type}.png`, { type: "image/png" });
        const fileWithPreview = Object.assign(file, { preview: `data:image/png;base64,${base64}` });
        setImage(fileWithPreview);
        setMode('upload');
    }

    return (
        <div className="bg-[#1c1e20] rounded-2xl border border-[#ffffff1a] overflow-hidden flex flex-col h-[32rem] shadow-lg transition-all hover:border-[#ffffff33]">
            <div className="p-4 border-b border-[#ffffff0d] flex justify-between items-center bg-[#151618]">
                <div className="flex flex-col">
                    <span className="font-bold text-sm flex items-center gap-2 text-gray-200">
                        {icon} {title} {isRemix && <span className="text-purple-400 text-[10px]">(Detected)</span>}
                    </span>
                    {description && <span className="text-[11px] text-gray-500 ml-7 leading-tight mt-0.5">{description}</span>}
                </div>
                {(image || genPrompt) && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setImage(null); setGenPrompt(''); setMode('upload'); setPreviews([]); }}
                        className="text-[10px] font-bold text-gray-500 hover:text-red-500 uppercase tracking-wider"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="flex-grow relative group bg-[#0b0b0b] overflow-hidden">
                {mode === 'upload' ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full cursor-pointer relative"
                    >
                        {image ? (
                            <>
                                <img src={image.preview} className="w-full h-full object-cover" alt="preview" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="bg-black/60 px-3 py-1.5 rounded-lg text-xs font-bold text-white backdrop-blur">
                                        {isRemix ? 'Swap Image' : 'Change Image'}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <img src={placeholderUrl} className="w-full h-full object-cover opacity-30 transition-opacity group-hover:opacity-20" alt="placeholder" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                    <div className="w-16 h-16 rounded-full bg-[#ff0000] flex items-center justify-center mb-3 shadow-lg shadow-red-900/30 hover:scale-110 transition-transform">
                                        <PlusIcon className="size-8 text-white" />
                                    </div>
                                    <span className="text-sm font-bold text-white drop-shadow-md block">Upload {title}</span>
                                    <span className="text-[10px] font-medium text-white/70 mt-1">(Photo or Sketch)</span>
                                </div>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*"/>
                    </div>
                ) : (
                    <div className="w-full h-full p-4 flex flex-col bg-[#0b0b0b]">
                         <div className="flex items-center gap-2 mb-2 text-[#ff0000]">
                            <MagicWandIcon className="size-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">AI Description</span>
                         </div>
                         
                         <div className="relative mb-4">
                            <textarea 
                                value={genPrompt}
                                onChange={(e) => setGenPrompt(e.target.value)}
                                placeholder={`Describe the ${title.toLowerCase()}...`}
                                className="w-full h-20 bg-[#1c1e20] rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-[#ff0000] placeholder-gray-600"
                            />
                            <button 
                                onClick={handleGeneratePreviews}
                                disabled={!genPrompt || isGeneratingPreviews}
                                className="absolute bottom-2 right-2 bg-[#ff0000] text-white p-1.5 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors text-xs font-bold flex items-center gap-1"
                            >
                                {isGeneratingPreviews ? '...' : 'Go'}
                            </button>
                         </div>

                         {type === 'background' && (
                             <div className="mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                 <div className="flex gap-2">
                                     {backgroundStyles.map(s => (
                                         <button 
                                            key={s.id}
                                            onClick={() => setSelectedBgStyle(s)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${selectedBgStyle.id === s.id ? 'bg-white text-black border-white' : 'bg-[#1c1e20] text-gray-500 border-[#ffffff1a] hover:border-gray-400'}`}
                                         >
                                             {s.label}
                                         </button>
                                     ))}
                                 </div>
                             </div>
                         )}

                         <div className="flex-grow overflow-y-auto custom-scrollbar">
                             {isGeneratingPreviews ? (
                                 <div className="h-full flex items-center justify-center text-gray-600 text-xs animate-pulse">
                                     Generating {title} variations...
                                 </div>
                             ) : previews.length > 0 ? (
                                 <div className="grid grid-cols-2 gap-2">
                                     {previews.map((preview, idx) => (
                                         <button 
                                            key={idx} 
                                            onClick={() => handleSelectPreview(preview)}
                                            className="aspect-square rounded-lg overflow-hidden relative group border border-transparent hover:border-[#ff0000]"
                                         >
                                             <img src={`data:image/png;base64,${preview}`} className="w-full h-full object-cover" alt="preview" />
                                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                 <span className="text-[10px] font-bold text-white">Select</span>
                                             </div>
                                         </button>
                                     ))}
                                 </div>
                             ) : (
                                 <div className="h-full flex items-center justify-center text-gray-700 text-xs text-center px-4">
                                     Enter a prompt and click 'Go' to see AI options.
                                 </div>
                             )}
                         </div>
                    </div>
                )}
            </div>
            
            <div className="p-3 bg-[#151618] border-t border-[#ffffff0d]">
                {mode === 'upload' ? (
                     <button 
                        onClick={() => setMode('generate')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all bg-[#1c1e20] text-gray-300 hover:bg-[#2e3031] hover:text-white"
                    >
                        <MagicWandIcon className="size-4" />
                        Generate with AI
                    </button>
                ) : (
                    <button 
                        onClick={() => setMode('upload')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all bg-[#1c1e20] text-gray-300 hover:bg-[#2e3031] hover:text-white"
                    >
                        <PlusIcon className="size-4" />
                        Switch to Upload
                    </button>
                )}
            </div>
        </div>
    )
}

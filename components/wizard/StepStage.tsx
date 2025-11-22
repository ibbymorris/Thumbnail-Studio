
import React, { useState, useEffect, useRef } from 'react';
import { WizardMode, RemixAnalysis, FileWithPreview, Emotion } from '../../types';
import { generateAsset, base64ToBlob } from '../../services/geminiService';
import { 
    UserIcon, LayersIcon, UploadIcon, SparklesIcon, XIcon, CheckIcon, MagicWandIcon, FaceIcon, 
    TrendingIcon, LockIcon, UnlockIcon, RefreshCwIcon, HeartIcon, ArrowRightIcon, PlusIcon, 
    ImageIcon, PaletteIcon
} from '../icons';
import { Button } from '../ui/Shared';

// --- Types & Component ---

interface Props {
    mode: WizardMode;
    remixAnalysis?: RemixAnalysis | null;
    
    subjectMode: 'upload' | 'generate'; setSubjectMode: (m: 'upload' | 'generate') => void;
    subjectImage: FileWithPreview | null; setSubjectImage: (f: FileWithPreview | null) => void;
    subjectGenPrompt: string; setSubjectGenPrompt: React.Dispatch<React.SetStateAction<string>>;
    
    propMode: 'upload' | 'generate'; setPropMode: (m: 'upload' | 'generate') => void;
    propImage: FileWithPreview | null; setPropImage: (f: FileWithPreview | null) => void;
    propGenPrompt: string; setPropGenPrompt: React.Dispatch<React.SetStateAction<string>>;

    bgMode: 'upload' | 'generate'; setBgMode: (m: 'upload' | 'generate') => void;
    bgImage: FileWithPreview | null; setBgImage: (f: FileWithPreview | null) => void;
    bgGenPrompt: string; setBgGenPrompt: React.Dispatch<React.SetStateAction<string>>;

    handleFile: (e: React.ChangeEvent<HTMLInputElement>, setter: (f: FileWithPreview) => void) => void;
    subjectRef: React.RefObject<HTMLInputElement | null>; 
    propRef: React.RefObject<HTMLInputElement | null>; 
    bgRef: React.RefObject<HTMLInputElement | null>;

    // Merged Action Props
    emotion: Emotion | undefined; setEmotion: (e: Emotion | undefined) => void;
    emotionIntensity: number; setEmotionIntensity: (n: number) => void;
    posePrompt: string; setPosePrompt: (s: string) => void;
    
    isBrainstorming?: boolean;
}

type AssetType = 'subject' | 'prop' | 'background';
type CreationMethod = 'upload' | 'generate';

interface AssetSummaryCardProps {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    image: FileWithPreview | null;
    placeholder: string | undefined;
    onClick: () => void;
    conceptText: string;
    isBrainstorming?: boolean;
    isLocked: boolean;
    onLockToggle: (e: React.MouseEvent) => void;
}

const AssetSummaryCard = ({ title, icon: Icon, image, placeholder, onClick, conceptText, isBrainstorming, isLocked, onLockToggle }: AssetSummaryCardProps) => {
    const source = image?.source || 'ai';
    
    return (
    <div 
        onClick={onClick}
        className={`group relative bg-[#1c1e20] border rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:shadow-red-900/10 flex flex-col h-[360px]
            ${isLocked ? 'border-red-500/30 ring-1 ring-red-500/20' : 'border-white/10 hover:border-red-500/50'}
        `}
    >
        {/* Image Area */}
        <div className="h-48 relative overflow-hidden bg-black/50">
            <img 
                src={image?.preview || placeholder} 
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${!image ? 'opacity-40 grayscale blur-sm' : 'opacity-100'}`}
                alt={title}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#1c1e20]" />
            
            {/* Top Bar */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                {image ? (
                    <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 backdrop-blur-md ${source === 'ai' ? 'bg-purple-500/80 text-white' : 'bg-blue-500/80 text-white'}`}>
                        {source === 'ai' ? <SparklesIcon className="w-3 h-3" /> : <UploadIcon className="w-3 h-3" />}
                        {source === 'ai' ? 'AI Generated' : 'Uploaded'}
                    </div>
                ) : (
                    <div className="bg-black/60 text-gray-300 text-[10px] font-bold px-2 py-1 rounded-full border border-white/10 flex items-center gap-1 backdrop-blur-md">
                         <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" /> Draft Ready
                    </div>
                )}
                
                <button 
                    onClick={onLockToggle}
                    className={`p-2 rounded-full transition-colors backdrop-blur-md ${isLocked ? 'bg-red-500 text-white' : 'bg-black/40 text-gray-400 hover:bg-black/60 hover:text-white'}`}
                >
                    {isLocked ? <LockIcon className="w-3 h-3" /> : <UnlockIcon className="w-3 h-3" />}
                </button>
            </div>

            {/* Center CTA if empty */}
            {!image && conceptText && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs font-bold border border-white/10 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        ✨ AI Suggestion Available
                    </div>
                 </div>
            )}
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-grow relative">
            <div className="flex items-center gap-2 mb-3 text-white">
                <div className={`p-1.5 rounded ${isLocked ? 'bg-red-500/20 text-red-400' : 'bg-white/10'}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold font-['Space_Grotesk'] uppercase tracking-wide text-sm">{title}</h3>
            </div>

            <div className="flex-grow relative">
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block flex items-center gap-2">
                    AI Draft <div className="h-px flex-grow bg-white/10"></div>
                </label>
                {isBrainstorming && !conceptText ? (
                     <div className="space-y-2 mt-2">
                         <div className="h-3 bg-white/10 rounded animate-pulse w-3/4"></div>
                         <div className="h-3 bg-white/10 rounded animate-pulse w-full"></div>
                     </div>
                ) : (
                    <p className="text-sm text-gray-300 leading-snug line-clamp-2 italic">
                        "{conceptText || "No concept defined..."}"
                    </p>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">
                     {image ? 'ASSET LOCKED' : 'READY TO GEN'}
                </span>
                <button className="text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 group-hover:border-white/20">
                    {image ? 'Edit / Replace' : 'Accept & Tweak'}
                </button>
            </div>
        </div>
    </div>
)};

export const StepStage = (props: Props) => {
    const [expandedType, setExpandedType] = useState<AssetType | null>(null);
    const [activeTab, setActiveTab] = useState<CreationMethod>('generate'); 
    const [previews, setPreviews] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Locked States
    const [isSubjectLocked, setIsSubjectLocked] = useState(false);
    const [isPropLocked, setIsPropLocked] = useState(false);
    const [isBgLocked, setIsBgLocked] = useState(false);

    // Auto-Generate All state
    const [isAutoCreating, setIsAutoCreating] = useState(false);
    
    // Brand Kit State (Mock)
    const [useBrandKit, setUseBrandKit] = useState(true);

    // Helper to get placeholder safely
    const getPlaceholder = (type: AssetType) => {
        if (props.mode === 'remix' && props.remixAnalysis) {
            if (type === 'subject' && props.remixAnalysis.subjects?.[0]?.thumbnailUrl) return props.remixAnalysis.subjects[0].thumbnailUrl;
            if (type === 'prop' && props.remixAnalysis.props?.[0]?.thumbnailUrl) return props.remixAnalysis.props[0].thumbnailUrl;
            if (type === 'background' && props.remixAnalysis.background?.thumbnailUrl) return props.remixAnalysis.background.thumbnailUrl;
        }
        
        if (type === 'subject') return "https://res.cloudinary.com/ditco4c8e/image/upload/v1763648988/Mr_Beast_nraatg.png";
        if (type === 'prop') return "https://res.cloudinary.com/ditco4c8e/image/upload/v1763651949/Jet_Ski_qcdkct.png";
        if (type === 'background') return "https://res.cloudinary.com/ditco4c8e/image/upload/v1763652090/pexels-asadphoto-1430677_abqwnf.jpg";
        
        return undefined;
    };

    const getContext = () => {
        switch(expandedType) {
            case 'subject': return {
                title: 'Main Subject',
                image: props.subjectImage,
                setImage: props.setSubjectImage,
                prompt: props.subjectGenPrompt,
                setPrompt: props.setSubjectGenPrompt,
                mode: props.subjectMode,
                setMode: props.setSubjectMode,
                placeholder: getPlaceholder('subject')
            };
            case 'prop': return {
                title: 'Key Prop',
                image: props.propImage,
                setImage: props.setPropImage,
                prompt: props.propGenPrompt,
                setPrompt: props.setPropGenPrompt,
                mode: props.propMode,
                setMode: props.setPropMode,
                placeholder: getPlaceholder('prop')
            };
            case 'background': return {
                title: 'Background',
                image: props.bgImage,
                setImage: props.setBgImage,
                prompt: props.bgGenPrompt,
                setPrompt: props.setBgGenPrompt,
                mode: props.bgMode,
                setMode: props.setBgMode,
                placeholder: getPlaceholder('background')
            };
            default: return null;
        }
    };

    const context = getContext();

    const handleAutoGenerateAll = async () => {
        if (!window.aistudio) return;
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) { await window.aistudio.openSelectKey(); return; }

        setIsAutoCreating(true);

        const tasks = [];

        if (!props.subjectImage && !isSubjectLocked && props.subjectGenPrompt) {
            tasks.push(generateAsset(props.subjectGenPrompt, 'subject').then(b64 => {
                const f = new File([base64ToBlob(b64)], 'subject.png', { type: 'image/png' });
                Object.assign(f, { preview: `data:image/png;base64,${b64}`, source: 'ai' });
                props.setSubjectImage(f as FileWithPreview);
            }));
        }

        if (!props.propImage && !isPropLocked && props.propGenPrompt) {
            tasks.push(generateAsset(props.propGenPrompt, 'prop').then(b64 => {
                 const f = new File([base64ToBlob(b64)], 'prop.png', { type: 'image/png' });
                Object.assign(f, { preview: `data:image/png;base64,${b64}`, source: 'ai' });
                props.setPropImage(f as FileWithPreview);
            }));
        }

        if (!props.bgImage && !isBgLocked && props.bgGenPrompt) {
            tasks.push(generateAsset(props.bgGenPrompt, 'background').then(b64 => {
                 const f = new File([base64ToBlob(b64)], 'bg.png', { type: 'image/png' });
                Object.assign(f, { preview: `data:image/png;base64,${b64}`, source: 'ai' });
                props.setBgImage(f as FileWithPreview);
            }));
        }

        await Promise.all(tasks);
        setIsAutoCreating(false);
    };

    const handleGenerateInModal = async () => {
        if (!context || !expandedType) return;
        if (!window.aistudio) return;
        
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) { await window.aistudio.openSelectKey(); return; }

        setIsGenerating(true);
        setPreviews([]);
        context.setMode('generate');

        try {
            let finalPrompt = context.prompt;
            if (expandedType === 'subject') {
                const posePart = props.posePrompt ? ` Pose: ${props.posePrompt}.` : '';
                const emotionPart = props.emotion ? ` Facial Expression: ${props.emotion}.` : '';
                finalPrompt = `${finalPrompt}.${posePart}${emotionPart}`;
            }
            // Generate 4 variations
            const promises = [1, 2, 3, 4].map(() => generateAsset(finalPrompt, expandedType));
            const results = await Promise.all(promises);
            setPreviews(results);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectPreview = (base64: string) => {
        if (!context || !expandedType) return;
        const blob = base64ToBlob(base64);
        const file = new File([blob], `generated-${expandedType}.png`, { type: "image/png" });
        const fileWithPreview = Object.assign(file, { preview: `data:image/png;base64,${base64}`, source: 'ai' });
        context.setImage(fileWithPreview as FileWithPreview);
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (context && e.target.files && e.target.files[0]) {
            // Manually handle to set source
            const file = e.target.files[0];
            const fWithPreview = Object.assign(file, { preview: URL.createObjectURL(file), source: 'upload' });
            context.setImage(fWithPreview as FileWithPreview);
            context.setMode('upload');
            e.target.value = '';
        }
    };

    const getChips = (type: AssetType) => {
        if (type === 'subject') return ["Closer to camera", "Strong rim light", "YouTube Outline", "Looking at camera"];
        if (type === 'prop') return ["Giant Scale", "Floating", "3D Render", "Glowing"];
        if (type === 'background') return ["Blur City", "Dark Studio", "Neon", "Gradient"];
        return [];
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header & Auto-Create CTA */}
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold font-['Space_Grotesk']">Set the Stage</h2>
                <p className="text-gray-400 text-lg">Review AI drafts or create your assets.</p>
                
                <div className="flex justify-center mt-4">
                     <button 
                        onClick={handleAutoGenerateAll}
                        disabled={isAutoCreating}
                        className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isAutoCreating ? <RefreshCwIcon className="w-5 h-5 animate-spin" /> : <MagicWandIcon className="w-5 h-5" />}
                        {isAutoCreating ? 'Creating Assets...' : 'Auto-create Subject, Prop & Background'}
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AssetSummaryCard 
                    title="Main Subject" 
                    icon={UserIcon} 
                    image={props.subjectImage} 
                    placeholder={getPlaceholder('subject')}
                    onClick={() => { setExpandedType('subject'); setActiveTab(props.subjectImage ? 'upload' : 'generate'); setPreviews([]); }}
                    conceptText={props.subjectGenPrompt}
                    isBrainstorming={props.isBrainstorming}
                    isLocked={isSubjectLocked}
                    onLockToggle={(e) => { e.stopPropagation(); setIsSubjectLocked(!isSubjectLocked); }}
                />
                <AssetSummaryCard 
                    title="Key Prop" 
                    icon={LayersIcon} 
                    image={props.propImage}
                    placeholder={getPlaceholder('prop')}
                    onClick={() => { setExpandedType('prop'); setActiveTab(props.propImage ? 'upload' : 'generate'); setPreviews([]); }}
                    conceptText={props.propGenPrompt}
                    isBrainstorming={props.isBrainstorming}
                    isLocked={isPropLocked}
                    onLockToggle={(e) => { e.stopPropagation(); setIsPropLocked(!isPropLocked); }}
                />
                <AssetSummaryCard 
                    title="Background" 
                    icon={ImageIcon} 
                    image={props.bgImage}
                    placeholder={getPlaceholder('background')}
                    onClick={() => { setExpandedType('background'); setActiveTab(props.bgImage ? 'upload' : 'generate'); setPreviews([]); }}
                    conceptText={props.bgGenPrompt}
                    isBrainstorming={props.isBrainstorming}
                    isLocked={isBgLocked}
                    onLockToggle={(e) => { e.stopPropagation(); setIsBgLocked(!isBgLocked); }}
                />
            </div>

            {/* --- EXPANDED STUDIO MODAL --- */}
            {expandedType && context && (
                <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Modal Top Bar */}
                    <div className="h-20 flex items-center justify-center relative border-b border-white/10 bg-[#0f1115]">
                        {/* Asset Switcher */}
                        <div className="flex bg-black/40 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                            {['subject', 'prop', 'background'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => { setExpandedType(t as AssetType); setPreviews([]); setActiveTab('generate'); }}
                                    className={`
                                        px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2
                                        ${expandedType === t 
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    {t === 'subject' && <UserIcon className="w-3 h-3" />}
                                    {t === 'prop' && <LayersIcon className="w-3 h-3" />}
                                    {t === 'background' && <ImageIcon className="w-3 h-3" />}
                                    {t}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => setExpandedType(null)}
                            className="absolute right-8 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all border border-white/5 hover:border-white/20"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Left: Visual Canvas */}
                        <div className="flex-1 bg-[#050507] p-8 flex flex-col items-center justify-center relative">
                            <div className="relative w-full max-w-3xl aspect-video bg-[#0f1115] border border-dashed border-white/20 rounded-3xl overflow-hidden group flex items-center justify-center shadow-2xl transition-all hover:border-white/30">
                                {context.image ? (
                                    <>
                                        <img src={context.image.preview} className="h-full w-full object-contain p-4" alt="preview" />
                                        {/* Quick Actions Overlay */}
                                        <div className="absolute bottom-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => context.setImage(null)} className="px-4 py-2 bg-black/60 backdrop-blur border border-red-500/50 text-red-400 rounded-full font-bold text-xs hover:bg-red-500 hover:text-white transition-colors">
                                                Remove
                                            </button>
                                            <button className="px-4 py-2 bg-black/60 backdrop-blur border border-white/20 text-white rounded-full font-bold text-xs hover:bg-white hover:text-black transition-colors">
                                                Favorite <HeartIcon className="w-3 h-3 inline ml-1"/>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-gray-600">
                                        <div className="w-20 h-20 rounded-full bg-[#1c1e20] flex items-center justify-center border border-white/10">
                                            <UploadIcon className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm font-bold">Drag & Drop or Use Controls</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Strip of Options */}
                            {previews.length > 0 && (
                                <div className="mt-8 w-full max-w-3xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Generated Options</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        {previews.map((p, idx) => (
                                            <div 
                                                key={idx} 
                                                onClick={() => handleSelectPreview(p)}
                                                className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all relative group ${context.image?.preview.includes(p) ? 'border-red-500' : 'border-white/10 hover:border-white/30'}`}
                                            >
                                                <img src={`data:image/png;base64,${p}`} className="w-full h-full object-cover" alt="opt" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-[10px] font-bold bg-black/50 px-2 py-1 rounded backdrop-blur">Use This</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Controls Sidebar */}
                        <div className="w-[400px] bg-[#0f1115] border-l border-white/10 flex flex-col z-20 shadow-2xl">
                            
                            {/* Shortcuts */}
                            <div className="p-6 pb-0">
                                {expandedType === 'subject' && (
                                    <Button variant="secondary" className="w-full text-xs mb-4 py-3 border-dashed">
                                        <UserIcon className="w-4 h-4 text-purple-400" /> Use My Creator Persona
                                    </Button>
                                )}
                                {expandedType === 'prop' && (
                                    <Button variant="secondary" className="w-full text-xs mb-4 py-3 border-dashed">
                                        <LayersIcon className="w-4 h-4 text-purple-400" /> Upload Product Photo
                                    </Button>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                                {/* Recipe Section */}
                                <section>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                        Prompt Recipe
                                    </label>
                                    <textarea 
                                        value={context.prompt}
                                        onChange={(e) => context.setPrompt(e.target.value)}
                                        placeholder="Describe details..."
                                        className="w-full h-28 bg-[#1c1e20] border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 focus:outline-none placeholder-gray-600"
                                    />
                                    
                                    {/* Chips */}
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {getChips(expandedType).map(chip => (
                                            <button 
                                                key={chip}
                                                onClick={() => context.setPrompt((prev: string) => prev ? `${prev}, ${chip}` : chip)}
                                                className="text-[10px] font-medium px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-md text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                            >
                                                <PlusIcon className="w-2 h-2" /> {chip}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Brand Kit */}
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
                                            <PaletteIcon className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-200">Brand Kit</span>
                                            <span className="text-[10px] text-gray-500">Apply brand colors</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setUseBrandKit(!useBrandKit)}
                                        className={`w-8 h-4 rounded-full transition-colors relative ${useBrandKit ? 'bg-purple-500' : 'bg-gray-700'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${useBrandKit ? 'left-4.5' : 'left-0.5'}`} />
                                    </button>
                                </div>

                                {/* Generation Button */}
                                <button 
                                    onClick={handleGenerateInModal}
                                    disabled={isGenerating || !context.prompt}
                                    className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-bold text-white shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 transition-all"
                                >
                                    {isGenerating ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : <MagicWandIcon className="w-4 h-4" />}
                                    {isGenerating ? 'Generating...' : 'Generate 4 Options'}
                                </button>
                                
                                {/* Upload Alternative */}
                                <div className="text-center pt-4 border-t border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Or upload your own</span>
                                    <label className="block w-full py-2 text-xs text-gray-400 hover:text-white border border-dashed border-white/10 hover:border-white/30 rounded-lg cursor-pointer transition-all text-center">
                                        Upload Image File
                                        <input type="file" className="hidden" onChange={onFileInputChange} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                            
                            {/* Quick Exit */}
                            <div className="p-4 border-t border-white/10 bg-[#0b0b0b]">
                                <button 
                                    onClick={() => setExpandedType(null)}
                                    className="w-full text-xs text-gray-500 hover:text-white flex items-center justify-center gap-1 transition-colors"
                                >
                                    Skip asset fine-tuning – just give me a thumbnail <ArrowRightIcon className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

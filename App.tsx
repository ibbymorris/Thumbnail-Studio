
import React, { useState, useRef, useEffect } from 'react';
import { ToolType, ThumbnailStyle, FileWithPreview, ToolData, GenerationConfig, AspectRatio, Emotion, BrandKit, InspirationItem, Layer, WizardMode, WizardStep, RemixAnalysis, RemixConfig, ThumbCopilotContext, CompositionType, VariantStrategy } from './types';
import { 
    VideoIcon, SketchIcon, DrawVideoIcon, UploadIcon, StarIcon, 
    XIcon, DownloadIcon, DrawEditIcon,
    SoraIcon, BlankIcon, TextIcon, PaletteIcon, FaceIcon, TrendingIcon, LayersIcon, ArrowIcon, PlusIcon, MenuIcon, LinkIcon, MagicWandIcon, ChevronRight, ChevronLeft,
    SearchIcon, ImageDownIcon, ChevronLeftIcon, ChevronRightIcon
} from './components/icons';
import { generateThumbnail, fileToBase64, generateAsset, base64ToBlob, analyzeImage, cropImageFromBase64, extractElement, removeForeground, analyzeThumbnailConcept } from './services/geminiService';

// New Wizard Components
import { StepIdea } from './components/wizard/StepIdea';
import { StepRemixAnalysis } from './components/wizard/StepRemixAnalysis';
import { StepStage } from './components/wizard/StepStage';
import { StepComposition } from './components/wizard/StepComposition';
import { StepPolish } from './components/wizard/StepPolish';
import { ThumbCopilot } from './components/copilot/ThumbCopilot';
import { Button } from './components/ui/Shared';

// Remix Studio
import ThumbnailStudio from './components/remix/ThumbnailStudio';

// ==========================================
// === Data =================================
// ==========================================

const trendingItems: InspirationItem[] = [
    {
        id: '1',
        title: 'I Quit My Job',
        imageUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=800&q=80',
        views: '2.4M',
        style: 'reaction',
        promptTemplate: 'A person looking sad and holding a cardboard box in an office setting, text "I QUIT"'
    },
    {
        id: '2',
        title: 'iPhone 16 Review',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        views: '1.8M',
        style: 'tech',
        promptTemplate: 'Close up of latest smartphone, tech background, text "WORTH IT?"'
    },
    {
        id: '3',
        title: '$1 vs $1,000,000',
        imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80',
        views: '5.1M',
        style: 'gaming',
        promptTemplate: 'Split screen comparison, cheap burger vs gold burger, text "$1 vs $1M"'
    }
];

// ==========================================
// === Main App Component ===================
// ==========================================

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'create' | 'templates' | 'studio' | 'grabber' | 'remix-studio'>('create');
    const [initialPrompt, setInitialPrompt] = useState<string>('');
    const [initialRemixLink, setInitialRemixLink] = useState<string>('');
    const [remixImageUrl, setRemixImageUrl] = useState<string | null>(null);

    const handleTemplateSelect = (template: InspirationItem) => {
        // For templates, we might just grab the image URL and go to remix studio
        setRemixImageUrl(template.imageUrl);
        setCurrentView('remix-studio');
    };

    const handleGrabberRemix = (url: string) => {
        // If it's a full YouTube link, we need to extract the ID to get the thumbnail
        // If it's already a thumbnail URL, use it directly
        let finalUrl = url;
        if (!url.includes('img.youtube.com') && (url.includes('youtube.com') || url.includes('youtu.be'))) {
             const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
             const match = url.match(regExp);
             if (match && match[2].length === 11) {
                 finalUrl = `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
             }
        }
        setRemixImageUrl(finalUrl);
        setCurrentView('remix-studio');
    }
    
    return (
      <div className="min-h-screen w-full bg-[#0b0b0b] text-[#f7f7f8] font-['Inter',sans-serif] flex flex-col overflow-hidden">
        {/* Top Navigation */}
        {currentView !== 'remix-studio' && (
            <nav className="border-b border-[#ffffff0d] bg-[#0b0b0b] z-50 h-14 flex-shrink-0">
            <div className="w-full h-full px-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('create')}>
                        <div className="size-7 rounded bg-gradient-to-br from-[#ff0000] to-[#cc0000] flex items-center justify-center shadow-lg shadow-red-900/20">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-['Space_Grotesk'] font-bold text-lg">Thumb.AI</span>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-[#1c1e20] p-1 rounded-lg border border-[#ffffff0d]">
                        <button 
                            onClick={() => setCurrentView('create')}
                            className={`px-4 py-1 text-xs font-bold rounded transition-all ${currentView === 'create' ? 'bg-[#0b0b0b] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Create
                        </button>
                        <button 
                            onClick={() => setCurrentView('templates')}
                            className={`px-4 py-1 text-xs font-bold rounded transition-all ${currentView === 'templates' ? 'bg-[#0b0b0b] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Templates
                        </button>
                        <button 
                            onClick={() => setCurrentView('grabber')}
                            className={`px-4 py-1 text-xs font-bold rounded transition-all ${currentView === 'grabber' ? 'bg-[#0b0b0b] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Downloader
                        </button>
                        <button 
                            onClick={() => setCurrentView('studio')}
                            className={`px-4 py-1 text-xs font-bold rounded transition-all ${currentView === 'studio' ? 'bg-[#0b0b0b] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Studio
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-medium text-gray-500 bg-[#1c1e20] px-2 py-1 rounded-full border border-[#ffffff0d]">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Gemini 2.5 Active
                    </div>
                </div>
            </div>
            </nav>
        )}
        
        {/* Main Content Area */}
        <main className="flex-grow overflow-hidden relative">
            {currentView === 'create' ? (
                <div className="h-full overflow-y-auto custom-scrollbar bg-[#0b0b0b]">
                    <WizardView initialPrompt={initialPrompt} initialRemixLink={initialRemixLink} />
                </div>
            ) : currentView === 'templates' ? (
                <div className="h-full overflow-y-auto custom-scrollbar p-6">
                    <TemplatesView onSelect={handleTemplateSelect} />
                </div>
            ) : currentView === 'grabber' ? (
                <div className="h-full overflow-y-auto custom-scrollbar">
                    <GrabberView onRemix={handleGrabberRemix} />
                </div>
            ) : currentView === 'remix-studio' ? (
                <ThumbnailStudio initialImageUrl={remixImageUrl} onBack={() => setCurrentView('create')} />
            ) : (
                <StudioView />
            )}
        </main>
      </div>
    );
};

// ==========================================
// === Wizard View (Refactored) =============
// ==========================================

const WizardView = ({ initialPrompt, initialRemixLink }: { initialPrompt?: string, initialRemixLink?: string }) => {
    // Wizard State
    const [currentStep, setCurrentStep] = useState<WizardStep>('idea');
    const [mode, setMode] = useState<WizardMode>('fromScratch');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isBrainstorming, setIsBrainstorming] = useState(false);

    // Step 1: Idea
    const [title, setTitle] = useState("");
    const [ideaPrompt, setIdeaPrompt] = useState(initialPrompt || "");
    const [remixImage, setRemixImage] = useState<FileWithPreview | null>(null);

    // Step 2: Remix Analysis (New)
    const [remixAnalysis, setRemixAnalysis] = useState<RemixAnalysis | null>(null);
    const [remixConfig, setRemixConfig] = useState<RemixConfig | null>(null);

    // Step 3: Stage Assets
    const [subjectMode, setSubjectMode] = useState<'upload' | 'generate'>('upload');
    const [subjectImage, setSubjectImage] = useState<FileWithPreview | null>(null);
    const [subjectGenPrompt, setSubjectGenPrompt] = useState('');
    
    const [propMode, setPropMode] = useState<'upload' | 'generate'>('upload');
    const [propImage, setPropImage] = useState<FileWithPreview | null>(null);
    const [propGenPrompt, setPropGenPrompt] = useState('');
    
    const [bgMode, setBgMode] = useState<'upload' | 'generate'>('upload');
    const [bgImage, setBgImage] = useState<FileWithPreview | null>(null);
    const [bgGenPrompt, setBgGenPrompt] = useState('');

    // Merged Action State (Now part of Stage/Subject)
    const [emotion, setEmotion] = useState<Emotion | undefined>(undefined);
    const [emotionIntensity, setEmotionIntensity] = useState<number>(75);
    const [posePrompt, setPosePrompt] = useState('');

    // Step 4 (New): Composition
    const [composition, setComposition] = useState<CompositionType>('classic-right');

    // Step 6: Polish
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [overlayText, setOverlayText] = useState('');
    const [variantStrategy, setVariantStrategy] = useState<VariantStrategy>('mix');
    const [generateShorts, setGenerateShorts] = useState(false);
    const [style, setStyle] = useState<string>('Modern and Viral');
    
    // Brand Kit State
    const [useBrandColors, setUseBrandColors] = useState(false);
    const [brandKit, setBrandKit] = useState<BrandKit>({
        primaryColor: '#E1306C', // Default specific color for demo
        fontStyle: 'bold'
    });

    // Refs for file inputs
    const subjectFileInputRef = useRef<HTMLInputElement>(null);
    const propFileInputRef = useRef<HTMLInputElement>(null);
    const bgFileInputRef = useRef<HTMLInputElement>(null);

    // Handlers
    useEffect(() => {
        if (initialPrompt) {
            setIdeaPrompt(initialPrompt);
            setMode('fromScratch');
        }
        if (initialRemixLink) {
             setMode('remix');
        }
    }, [initialPrompt, initialRemixLink]);

    const handleRemixAssetSelect = async (file: File) => {
        // Just update state, do not change step yet
        const fileWithPreview = Object.assign(file, { preview: URL.createObjectURL(file) });
        setRemixImage(fileWithPreview);
        setMode('remix');
    };

    const performAnalysis = async () => {
        if (!remixImage) return;
        setIsAnalyzing(true);
        try {
            // Check API Key
            if (window.aistudio) {
                 const hasKey = await window.aistudio.hasSelectedApiKey();
                 if (!hasKey) await window.aistudio.openSelectKey();
            }
            
            const base64 = await fileToBase64(remixImage);
            const analysis = await analyzeImage(base64);
            
            // Start background cleaning in parallel
            let cleanBgPromise = removeForeground(base64).catch(e => {
                console.warn("Bg cleaning failed", e);
                return remixImage.preview;
            });

            // Generate extracted thumbnails for detected subjects and props
            const croppedSubjects = await Promise.all(
                analysis.subjects.map(async (sub) => {
                    if (sub.box_2d) {
                        const croppedBase64 = await cropImageFromBase64(base64, sub.box_2d);
                        try {
                             // Attempt to extract/remove background from the crop
                             const extractedUrl = await extractElement(croppedBase64, sub.name);
                             return { ...sub, thumbnailUrl: extractedUrl };
                        } catch(e) {
                             console.warn("Failed to extract subject, using crop", e);
                             return { ...sub, thumbnailUrl: `data:image/png;base64,${croppedBase64}` };
                        }
                    }
                    return { ...sub, thumbnailUrl: remixImage.preview };
                })
            );

            const croppedProps = await Promise.all(
                analysis.props.map(async (prop) => {
                    if (prop.box_2d) {
                        const croppedBase64 = await cropImageFromBase64(base64, prop.box_2d);
                         try {
                             // Attempt to extract/remove background from the crop
                             const extractedUrl = await extractElement(croppedBase64, prop.label);
                             return { ...prop, thumbnailUrl: extractedUrl };
                        } catch(e) {
                             console.warn("Failed to extract prop, using crop", e);
                             return { ...prop, thumbnailUrl: `data:image/png;base64,${croppedBase64}` };
                        }
                    }
                    return { ...prop, thumbnailUrl: remixImage.preview };
                })
            );

            const cleanBgUrl = await cleanBgPromise;

            // Hydrate analysis with new thumbnails
            const hydratedAnalysis: RemixAnalysis = {
                ...analysis,
                originalUrl: remixImage.preview,
                subjects: croppedSubjects,
                props: croppedProps,
                background: analysis.background ? { ...analysis.background, thumbnailUrl: cleanBgUrl } : null 
            };

            setRemixAnalysis(hydratedAnalysis);
            setRemixConfig({
                subjects: {}, props: {}, addedProps: [], background: { strategy: 'keep' }, textOverrides: {}, remixIntensity: 'medium'
            });

            if (hydratedAnalysis.textBoxes.length > 0) setOverlayText(hydratedAnalysis.textBoxes[0].content);
            if (hydratedAnalysis.detectedEmotion) setEmotion(hydratedAnalysis.detectedEmotion as Emotion);
            
            // Note: setCurrentStep removed from here to allow non-blocking transition
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Failed to analyze image. Please ensure you have selected a valid API key.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: FileWithPreview) => void) => {
        if (e.target.files?.[0]) {
            const file = Object.assign(e.target.files[0], { preview: URL.createObjectURL(e.target.files[0]) });
            setter(file);
        }
    };

    const handleNext = async () => {
        if (mode === 'remix' && currentStep === 'idea') {
            if (remixImage) {
                setCurrentStep('remixAnalysis'); // Move step immediately
                performAnalysis(); // Trigger analysis in background
            } else {
                alert("Please select a thumbnail to remix first.");
            }
            return;
        }

        // --- Concept Bridge Logic (From Scratch) - Non-Blocking Optimization ---
        if (mode === 'fromScratch' && currentStep === 'idea') {
            if (!ideaPrompt.trim()) {
                alert("Please describe your idea first.");
                return;
            }

            // Non-blocking brainstorming
            setIsBrainstorming(true);
            
            // We check key but don't await brainstorming for the navigation
            if (window.aistudio) {
                 window.aistudio.hasSelectedApiKey().then(hasKey => {
                    if (!hasKey) window.aistudio.openSelectKey();
                 });
            }

            // Fire and forget (update state when ready)
            analyzeThumbnailConcept(ideaPrompt).then(breakdown => {
                 if (breakdown.subject) {
                     setSubjectGenPrompt(breakdown.subject);
                     setSubjectMode('generate');
                 }
                 if (breakdown.prop) {
                     setPropGenPrompt(breakdown.prop);
                     setPropMode('generate');
                 }
                 if (breakdown.background) {
                     setBgGenPrompt(breakdown.background);
                     setBgMode('generate');
                 }
                 setIsBrainstorming(false);
            }).catch(e => {
                console.error("Brainstorming failed", e);
                setIsBrainstorming(false);
            });
        }

        const steps: WizardStep[] = mode === 'remix' 
            ? ['idea', 'remixAnalysis', 'stage', 'composition', 'polish']
            : ['idea', 'stage', 'composition', 'polish'];
        const idx = steps.indexOf(currentStep);
        if (idx < steps.length - 1) setCurrentStep(steps[idx + 1]);
    };

    const handleBack = () => {
        const steps: WizardStep[] = mode === 'remix' 
            ? ['idea', 'remixAnalysis', 'stage', 'composition', 'polish']
            : ['idea', 'stage', 'composition', 'polish'];
        const idx = steps.indexOf(currentStep);
        if (idx > 0) setCurrentStep(steps[idx - 1]);
    };

    // Generation Logic
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
         if (!window.aistudio) return;
         setIsGenerating(true);
         try {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) await window.aistudio.openSelectKey();

            let remixBytes, subjectBytes, propBytes, bgBytes;
            if (remixImage) remixBytes = await fileToBase64(remixImage);
            if (subjectImage) subjectBytes = await fileToBase64(subjectImage);
            if (propImage) propBytes = await fileToBase64(propImage);
            if (bgImage) bgBytes = await fileToBase64(bgImage);

            const config: GenerationConfig = {
                prompt: ideaPrompt + (subjectGenPrompt ? ` Subject: ${subjectGenPrompt}` : ''),
                remixImageBytes: remixBytes,
                subjectImageBytes: subjectBytes,
                propImageBytes: propBytes,
                backgroundImageBytes: bgBytes,
                overlayText,
                aspectRatio,
                emotion,
                emotionIntensity,
                pose: posePrompt,
                composition,
                variantStrategy,
                generateShorts,
                style,
                brandKit: useBrandColors ? brandKit : undefined
            };

            const url = await generateThumbnail(config);
            setGeneratedImageUrl(url);
         } catch(e: any) {
             setError(e.message || "Generation failed");
         } finally {
             setIsGenerating(false);
         }
    }

    // Copilot Context
    const copilotContext: ThumbCopilotContext = {
        step: currentStep,
        mode,
        videoTitle: title,
        overlayText,
        remixAnalysis,
        remixConfig
    };

    const handleCopilotSuggestion = (type: string, value: any) => {
        if (type === 'overlayText') setOverlayText(value);
    };

    return (
        <div className="h-full flex flex-col max-w-7xl mx-auto px-4 pt-8 pb-4 relative">
            {/* Wizard Progress */}
             <div className="flex items-center justify-center gap-2 mb-12">
                {['idea', 'remixAnalysis', 'stage', 'composition', 'polish'].map((s) => {
                    // Hide remixAnalysis dot if not in remix mode
                    if (mode !== 'remix' && s === 'remixAnalysis') return null;
                    
                    const steps = mode === 'remix' 
                        ? ['idea', 'remixAnalysis', 'stage', 'composition', 'polish']
                        : ['idea', 'stage', 'composition', 'polish'];
                    const isActive = steps.indexOf(s as WizardStep) <= steps.indexOf(currentStep);

                    return (
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${isActive ? 'w-8 bg-[#ff0000]' : 'w-2 bg-[#2e3031]'}`} />
                    )
                })}
            </div>

            <div className="flex-grow pb-20">
                 {generatedImageUrl ? (
                     <div className="animate-in zoom-in duration-300 h-full flex flex-col items-center justify-center">
                         <div className="relative max-w-4xl w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-6">
                             <img src={generatedImageUrl} className="w-full h-full object-contain bg-black" alt="Generated" />
                             <button onClick={() => setGeneratedImageUrl(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"><XIcon className="size-5"/></button>
                         </div>
                         <div className="flex gap-4">
                            <Button variant="secondary" onClick={() => setGeneratedImageUrl(null)}>Edit Settings</Button>
                            <a href={generatedImageUrl} download="thumbnail.png" className="px-6 py-3 rounded-xl bg-[#ff0000] text-white font-bold hover:bg-red-600 flex items-center gap-2">
                                <DownloadIcon className="size-5"/> Download
                            </a>
                         </div>
                     </div>
                 ) : (
                     <>
                        {currentStep === 'idea' && (
                            <StepIdea 
                                mode={mode} setMode={setMode} title={title} setTitle={setTitle}
                                ideaPrompt={ideaPrompt} setIdeaPrompt={setIdeaPrompt} onUpload={handleRemixAssetSelect}
                                onNext={handleNext}
                            />
                        )}
                        {currentStep === 'remixAnalysis' && (
                            <StepRemixAnalysis analysis={remixAnalysis} config={remixConfig} updateConfig={setRemixConfig} />
                        )}
                        {currentStep === 'stage' && (
                            <StepStage 
                                mode={mode} remixAnalysis={remixAnalysis}
                                subjectMode={subjectMode} setSubjectMode={setSubjectMode} subjectImage={subjectImage} setSubjectImage={setSubjectImage} subjectGenPrompt={subjectGenPrompt} setSubjectGenPrompt={setSubjectGenPrompt}
                                propMode={propMode} setPropMode={setPropMode} propImage={propImage} setPropImage={setPropImage} propGenPrompt={propGenPrompt} setPropGenPrompt={setPropGenPrompt}
                                bgMode={bgMode} setBgMode={setBgMode} bgImage={bgImage} setBgImage={setBgImage} bgGenPrompt={bgGenPrompt} setBgGenPrompt={setBgGenPrompt}
                                handleFile={handleFile} subjectRef={subjectFileInputRef} propRef={propFileInputRef} bgRef={bgFileInputRef}
                                // Action Props (Merged)
                                emotion={emotion} setEmotion={setEmotion}
                                emotionIntensity={emotionIntensity} setEmotionIntensity={setEmotionIntensity}
                                posePrompt={posePrompt} setPosePrompt={setPosePrompt}
                                isBrainstorming={isBrainstorming}
                            />
                        )}
                        {currentStep === 'composition' && (
                            <StepComposition 
                                mode={mode}
                                composition={composition}
                                setComposition={setComposition}
                            />
                        )}
                        {currentStep === 'polish' && (
                            <StepPolish 
                                mode={mode} overlayText={overlayText} setOverlayText={setOverlayText}
                                remixAnalysis={remixAnalysis}
                                aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} 
                                variantStrategy={variantStrategy} setVariantStrategy={setVariantStrategy}
                                generateShorts={generateShorts} setGenerateShorts={setGenerateShorts}
                                style={style} setStyle={setStyle}
                                useBrandColors={useBrandColors} setUseBrandColors={setUseBrandColors}
                                brandKit={brandKit} setBrandKit={setBrandKit}
                            />
                        )}
                     </>
                 )}
            </div>

             {/* Footer Controls */}
             {!generatedImageUrl && currentStep !== 'idea' && (
                <div className="fixed bottom-0 left-0 w-full bg-[#0b0b0b] border-t border-white/10 p-4 z-40">
                    <div className="max-w-5xl mx-auto flex justify-between items-center">
                        <Button variant="ghost" onClick={handleBack} disabled={currentStep === 'idea'}>
                            <ChevronLeftIcon className="w-5 h-5" /> Back
                        </Button>
                        
                        {currentStep === 'polish' ? (
                            <Button onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? 'Generating Magic...' : 'Generate Magic ✨'}
                            </Button>
                        ) : (
                            <Button variant="secondary" onClick={handleNext} disabled={isAnalyzing && mode === 'remix' && currentStep === 'remixAnalysis'}>
                                {isAnalyzing && mode === 'remix' && currentStep === 'remixAnalysis'
                                    ? 'Analyzing...' 
                                    : (currentStep === 'idea' && mode === 'remix' ? 'Next: Analyze' : 'Next')
                                } <ChevronRightIcon className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <ThumbCopilot context={copilotContext} onApplySuggestion={handleCopilotSuggestion} />
        </div>
    );
};

// ==========================================
// === Grabber View =========================
// ==========================================

const GrabberView = ({ onRemix }: { onRemix: (url: string) => void }) => {
    const [link, setLink] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleGrab = () => {
        const id = getYoutubeId(link);
        if (id) {
            setThumbnailUrl(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
        } else {
            setThumbnailUrl(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                    YouTube Thumbnail Downloader
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Instantly grab high-resolution thumbnails from any YouTube video. Download them directly or remix them with AI to boost your CTR.
                </p>
            </div>

            <div className="bg-[#1c1e20] border border-[#ffffff1a] rounded-2xl p-2 flex gap-2 max-w-2xl mx-auto mb-12 shadow-2xl">
                <div className="flex-grow relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <SearchIcon className="size-5 text-gray-500" />
                    </div>
                    <input 
                        type="text" 
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="Paste YouTube Video URL here..."
                        className="w-full h-14 bg-transparent pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleGrab()}
                    />
                </div>
                <button 
                    onClick={handleGrab}
                    className="bg-[#ff0000] hover:bg-red-600 text-white font-bold px-8 rounded-xl transition-colors"
                >
                    Grab
                </button>
            </div>

            {thumbnailUrl ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="aspect-video rounded-2xl overflow-hidden border border-[#ffffff1a] shadow-2xl mb-8 bg-black relative group">
                        <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur">Preview</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a 
                            href={thumbnailUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-8 bg-[#1c1e20] border border-[#ffffff1a] rounded-2xl hover:bg-[#2e3031] transition-colors group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ImageDownIcon className="size-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Download HD Image</h3>
                            <p className="text-gray-500 text-center text-sm">Get the original high-quality JPG file.</p>
                        </a>

                        <button 
                            onClick={() => onRemix(thumbnailUrl)}
                            className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#1c1e20] to-[#2a1010] border border-[#ff0000]/30 rounded-2xl hover:border-[#ff0000] transition-all group"
                        >
                            <div className="w-16 h-16 bg-[#ff0000]/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MagicWandIcon className="size-8 text-[#ff0000]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Remix with AI</h3>
                            <p className="text-gray-400 text-center text-sm">Edit text, swap faces, or change style.</p>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 mt-16">
                    {/* How It Works Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                       {/* Step 1 */}
                       <div className="bg-[#1c1e20]/50 border border-[#ffffff0d] p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-[#1c1e20] transition-colors">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                                <SearchIcon className="size-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">1. Find Video</h3>
                            <p className="text-sm text-gray-500">Locate any high-performing video on YouTube that you want to analyze or remix.</p>
                       </div>
                       
                       {/* Step 2 */}
                       <div className="bg-[#1c1e20]/50 border border-[#ffffff0d] p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-[#1c1e20] transition-colors">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                <LinkIcon className="size-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">2. Paste Link</h3>
                            <p className="text-sm text-gray-500">Copy the video URL from your browser address bar and paste it above.</p>
                       </div>

                       {/* Step 3 */}
                       <div className="bg-[#1c1e20]/50 border border-[#ffffff0d] p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-[#1c1e20] transition-colors">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
                                <MagicWandIcon className="size-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">3. Grab or Remix</h3>
                            <p className="text-sm text-gray-500">Download the 4K image instantly or use our AI to remix it into your own style.</p>
                       </div>
                    </div>

                    {/* Feature/Upsell Section */}
                    <div className="border-t border-[#ffffff0d] pt-12">
                        <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-center mb-8 text-gray-200">Why use the Grabber?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#ffffff05] transition-colors">
                                <div className="bg-gray-800 p-2 rounded-lg"><DownloadIcon className="size-5 text-white"/></div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Highest Resolution Available</h4>
                                    <p className="text-sm text-gray-500">We extract the maximum quality (MaxRes) version stored on YouTube servers, perfect for study or reuse.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#ffffff05] transition-colors">
                                <div className="bg-[#ff0000]/20 p-2 rounded-lg"><FaceIcon className="size-5 text-[#ff0000]"/></div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">AI Face Swapping</h4>
                                    <p className="text-sm text-gray-500">Take a viral thumbnail layout and instantly swap the subject with your own face using our Remix tool.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#ffffff05] transition-colors">
                                <div className="bg-purple-500/20 p-2 rounded-lg"><PaletteIcon className="size-5 text-purple-400"/></div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Style Theft (The Good Kind)</h4>
                                    <p className="text-sm text-gray-500">Analyze color palettes and composition choices from top creators like MrBeast or MKBHD.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#ffffff05] transition-colors">
                                <div className="bg-yellow-500/20 p-2 rounded-lg"><TrendingIcon className="size-5 text-yellow-400"/></div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Trend Hopping</h4>
                                    <p className="text-sm text-gray-500">See a format working? Grab it, tweak the text, and ride the wave before it crashes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// === Templates View =======================
// ==========================================

const TemplatesView = ({ onSelect }: { onSelect: (item: InspirationItem) => void }) => {
    return (
        <div className="max-w-7xl mx-auto">
             <div className="mb-8 text-center py-8">
                <h2 className="text-4xl font-bold font-['Space_Grotesk'] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Viral Inspiration</h2>
                <p className="text-gray-400">Browse high-performing templates and remix them for your channel.</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingItems.map(item => (
                    <div key={item.id} onClick={() => onSelect(item)} className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-[#1c1e20] border border-[#ffffff0d] hover:border-[#ff0000]/50 hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-300">
                        <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={item.title} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                             <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">Remix This</button>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                            <h4 className="text-lg font-bold truncate font-['Space_Grotesk']">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-1 text-xs font-mono text-green-400 bg-green-900/30 px-2 py-1 rounded w-fit">
                                <TrendingIcon className="size-3"/> {item.views} Views
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    )
}

// ==========================================
// === Studio (Canvas) View ===============
// ==========================================

const StudioView = () => {
    const [layers, setLayers] = useState<Layer[]>([
        { id: 'bg-1', type: 'background', content: '', x: 0, y: 0, width: 1280, height: 720, rotation: 0, scale: 100, zIndex: 0, name: 'Background' },
    ]);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>('bg-1');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Input States
    const [bgPrompt, setBgPrompt] = useState('');
    const [subjectPrompt, setSubjectPrompt] = useState('');
    
    // Selection Logic
    const selectedLayer = layers.find(l => l.id === selectedLayerId);

    const addLayer = (newLayer: Layer) => {
        setLayers(prev => [...prev.map(l => ({...l, zIndex: l.zIndex})), newLayer]);
        setSelectedLayerId(newLayer.id);
    };

    const updateLayer = (id: string, updates: Partial<Layer>) => {
        setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    const handleGenerateAsset = async (type: 'background' | 'subject' | 'prop') => {
        const prompt = type === 'background' ? bgPrompt : type === 'subject' ? subjectPrompt : '';
        if (!prompt) return;

        setIsGenerating(true);
        try {
            const assetBase64 = await generateAsset(prompt, type);
            
            const newLayer: Layer = {
                id: `${type}-${Date.now()}`,
                type: type,
                content: assetBase64,
                x: type === 'background' ? 0 : 100,
                y: type === 'background' ? 0 : 100,
                width: type === 'background' ? 1280 : 400,
                height: type === 'background' ? 720 : 400,
                rotation: 0,
                scale: 100,
                zIndex: layers.length + 1,
                name: type === 'background' ? 'New Background' : prompt,
                emotion: { joy: 0, shock: 0, anger: 0 }
            };

            if (type === 'background') {
                addLayer(newLayer);
            } else {
                addLayer(newLayer);
            }
        } catch (e) {
            console.error("Failed to generate asset", e);
            alert("Failed to generate asset. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
           // setSelectedLayerId(null);
        }
    };

    return (
        <div className="flex h-full w-full bg-[#0b0b0b]">
            {/* LEFT SIDEBAR: ASSETS */}
            <div className="w-80 border-r border-[#ffffff0d] flex flex-col bg-[#0b0b0b]">
                <div className="p-4 border-b border-[#ffffff0d] flex gap-4 text-xs font-bold text-gray-400">
                    <button className="text-[#ff0000] border-b-2 border-[#ff0000] pb-2">Assets</button>
                    <button className="hover:text-white pb-2 transition-colors">Brand</button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {/* Smart Upload */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <UploadIcon className="size-3" /> Smart Upload
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="aspect-square rounded-xl border border-dashed border-[#ffffff1a] hover:border-[#ff0000] hover:bg-[#ff0000]/5 transition-all flex flex-col items-center justify-center gap-2 group">
                                <div className="w-8 h-8 rounded-full bg-[#1c1e20] flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <PlusIcon className="size-4 text-white" />
                                </div>
                                <span className="text-xs font-medium text-gray-400 group-hover:text-white">Subject</span>
                            </button>
                            <button className="aspect-square rounded-xl border border-dashed border-[#ffffff1a] hover:border-[#ff0000] hover:bg-[#ff0000]/5 transition-all flex flex-col items-center justify-center gap-2 group">
                                <div className="w-8 h-8 rounded-full bg-[#1c1e20] flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <PlusIcon className="size-4 text-white" />
                                </div>
                                <span className="text-xs font-medium text-gray-400 group-hover:text-white">Prop</span>
                            </button>
                        </div>
                    </section>

                    <div className="h-px bg-[#ffffff0d]" />

                    {/* Generative Inputs */}
                    <section className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                                <SketchIcon className="size-3" /> Generative Background
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={bgPrompt}
                                    onChange={(e) => setBgPrompt(e.target.value)}
                                    placeholder="e.g. 'neon cyber city'" 
                                    className="w-full bg-[#1c1e20] border border-[#ffffff0d] rounded-lg p-2 text-xs text-white placeholder-gray-600 focus:border-[#ff0000] focus:outline-none"
                                />
                                <button 
                                    onClick={() => handleGenerateAsset('background')}
                                    disabled={isGenerating || !bgPrompt}
                                    className="absolute right-1 top-1 p-1 bg-[#ff0000] rounded hover:bg-red-600 disabled:opacity-50 text-white"
                                >
                                    <StarIcon className="size-3" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                                <FaceIcon className="size-3" /> Generative Subject
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={subjectPrompt}
                                    onChange={(e) => setSubjectPrompt(e.target.value)}
                                    placeholder="e.g. 'excited gamer'" 
                                    className="w-full bg-[#1c1e20] border border-[#ffffff0d] rounded-lg p-2 text-xs text-white placeholder-gray-600 focus:border-[#ff0000] focus:outline-none"
                                />
                                <button 
                                    onClick={() => handleGenerateAsset('subject')}
                                    disabled={isGenerating || !subjectPrompt}
                                    className="absolute right-1 top-1 p-1 bg-[#ff0000] rounded hover:bg-red-600 disabled:opacity-50 text-white"
                                >
                                    <StarIcon className="size-3" />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* CENTER: CANVAS */}
            <div className="flex-grow bg-[#050505] flex flex-col relative">
                {/* Floating Toolbar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-[#1c1e20] border border-[#ffffff1a] rounded-lg p-1 flex gap-1 shadow-xl">
                    <button className="p-2 hover:bg-[#2e3031] rounded text-white bg-[#2e3031]"><ArrowIcon className="size-4" /></button>
                    <button className="p-2 hover:bg-[#2e3031] rounded text-gray-400"><TextIcon className="size-4" /></button>
                    <button className="p-2 hover:bg-[#2e3031] rounded text-gray-400"><UploadIcon className="size-4" /></button>
                </div>

                {/* Canvas Area */}
                <div 
                    className="flex-grow flex items-center justify-center p-8 overflow-hidden"
                    onClick={handleCanvasClick}
                >
                    <div 
                        className="relative bg-black shadow-2xl ring-1 ring-white/10"
                        style={{
                            aspectRatio: '16/9',
                            height: 'min(100%, 720px)',
                            width: 'auto'
                        }}
                    >
                        {layers.map((layer) => (
                            <div 
                                key={layer.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLayerId(layer.id);
                                }}
                                className={`absolute cursor-move group transition-all`}
                                style={{
                                    left: layer.x,
                                    top: layer.y,
                                    width: layer.width,
                                    height: layer.height,
                                    transform: `rotate(${layer.rotation}deg) scale(${layer.scale / 100})`,
                                    zIndex: layer.zIndex
                                }}
                            >
                                {selectedLayerId === layer.id && (
                                    <div className="absolute -inset-0.5 border-2 border-[#ff0000] pointer-events-none z-50" />
                                )}
                                {layer.type === 'background' || layer.type === 'subject' || layer.type === 'prop' ? (
                                    layer.content ? 
                                    <img src={layer.content} alt={layer.name} className="w-full h-full object-cover pointer-events-none" /> 
                                    : <div className="w-full h-full bg-[#1c1e20] flex items-center justify-center text-gray-600 text-xs">Empty Layer</div>
                                ) : (
                                    <div className="text-white font-bold text-4xl">{layer.content}</div>
                                )}
                            </div>
                        ))}
                        
                        {isGenerating && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                                <div className="bg-[#1c1e20] border border-[#ffffff1a] px-4 py-2 rounded-lg flex items-center gap-3 text-sm text-white">
                                    <svg className="animate-spin h-4 w-4 text-[#ff0000]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Generative AI Working...
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDEBAR: PROPERTIES */}
            <div className="w-80 border-l border-[#ffffff0d] bg-[#0b0b0b] flex flex-col">
                <div className="p-4 border-b border-[#ffffff0d] flex justify-between items-center">
                    <span className="text-xs font-bold text-white">Layer Properties</span>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {selectedLayer ? (
                        <>
                            <div>
                                <input 
                                    type="text" 
                                    value={selectedLayer.name}
                                    onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
                                    className="w-full bg-[#1c1e20] border border-[#ffffff0d] rounded px-2 py-1.5 text-sm text-white focus:border-[#ff0000] focus:outline-none"
                                />
                            </div>

                            <section>
                                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <DrawEditIcon className="size-3" /> Transform
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center bg-[#1c1e20] rounded border border-[#ffffff0d] px-2">
                                        <span className="text-xs text-gray-500 w-4">X</span>
                                        <input 
                                            type="number" 
                                            value={selectedLayer.x}
                                            onChange={(e) => updateLayer(selectedLayer.id, { x: parseInt(e.target.value) })}
                                            className="w-full bg-transparent py-1.5 text-right text-xs text-white focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center bg-[#1c1e20] rounded border border-[#ffffff0d] px-2">
                                        <span className="text-xs text-gray-500 w-4">Y</span>
                                        <input 
                                            type="number" 
                                            value={selectedLayer.y}
                                            onChange={(e) => updateLayer(selectedLayer.id, { y: parseInt(e.target.value) })}
                                            className="w-full bg-transparent py-1.5 text-right text-xs text-white focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center bg-[#1c1e20] rounded border border-[#ffffff0d] px-2">
                                        <span className="text-xs text-gray-500 w-4">S</span>
                                        <input 
                                            type="number" 
                                            value={selectedLayer.scale}
                                            onChange={(e) => updateLayer(selectedLayer.id, { scale: parseInt(e.target.value) })}
                                            className="w-full bg-transparent py-1.5 text-right text-xs text-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-600 text-xs">
                            <p>Select a layer to edit properties</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;

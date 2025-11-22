
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  ChevronLeft, 
  Wand2, 
  Layers, 
  User, 
  Sparkles, 
  Upload, 
  Type, 
  Image as ImageIcon, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
  Move,
  Loader2,
  Trash2,
  Maximize2,
  X,
  RefreshCw,
  Palette,
  UserCircle,
  Package,
  FastForward,
  Plus
} from 'lucide-react';

// --- Mock Data ---
const INITIAL_DATA = {
  analysis: {
    score: 92,
    summary: "High-potential thumbnail with excellent emotional hook. The facial expression drives high CTR, but the background lacks depth relative to the subject.",
    insights: [
      { type: 'copy', title: "Emotional Hook", text: "Expression creates strong curiosity gap.", relatedId: 1 },
      { type: 'copy', title: "Text Contrast", text: "White/Red combo is highly legible.", relatedId: 5 },
      { type: 'change', title: "Background Depth", text: "Current gradient is too flat.", relatedId: 'bg-1' },
      { type: 'creative', title: "Prop Relevance", text: "Add 3D rendered object related to 'Money'.", relatedId: 3 }
    ]
  },
  background: {
    id: 'bg-1',
    name: 'Studio Dark Gradient',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=150&auto=format&fit=crop',
    type: 'background',
    action: 'keep', 
    boundingBox: { x: 0, y: 0, w: 100, h: 100 },
    prompt: 'Dark studio gradient, cinematic lighting, depth of field, 8k'
  },
  subjects: [
    { 
      id: 1, 
      name: 'Kevin Hart', 
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin&backgroundColor=b6e3f4', 
      type: 'subject',
      action: 'keep', 
      boundingBox: { x: 5, y: 20, w: 35, h: 60 },
      prompt: 'Portrait of Kevin Hart, surprised expression, studio lighting, looking at camera'
    },
    { 
      id: 2, 
      name: 'Steven Bartlett', 
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steven&backgroundColor=ffdfbf', 
      type: 'subject',
      action: 'keep',
      boundingBox: { x: 60, y: 25, w: 35, h: 55 },
      prompt: 'Portrait of Steven Bartlett, serious expression, dark clothing'
    },
  ],
  props: [
    { 
      id: 3, 
      name: '"NEW" Sticker', 
      icon: <Sparkles size={18} />,
      type: 'prop',
      action: 'keep', 
      boundingBox: { x: 2, y: 5, w: 15, h: 15 },
      prompt: 'Sticker graphic saying NEW, vibrant colors, vector art'
    },
    { 
      id: 4, 
      name: 'Diamond Chain', 
      icon: <Layers size={18} />,
      type: 'prop',
      action: 'keep', 
      boundingBox: { x: 15, y: 70, w: 15, h: 10 },
      prompt: 'Diamond chain necklace, sparkling, high detail, 3d render'
    }
  ],
  text: [
    {
      id: 5,
      content: "I don't give a...",
      font: 'Inter',
      weight: 'Extra Bold',
      spacing: '-0.05em',
      shadow: 'Hard Drop',
      color: '#FFFFFF',
      contrastFeatures: ['High Contrast'],
      type: 'text',
      action: 'keep',
      boundingBox: { x: 25, y: 10, w: 50, h: 20 },
      prompt: ''
    },
    {
      id: 6,
      content: "SH*T",
      font: 'Impact',
      weight: 'Regular',
      spacing: 'Normal',
      shadow: 'None',
      color: '#FFFFFF',
      contrastFeatures: ['Red Highlight', 'Rotation', 'Color Pop'],
      type: 'text',
      action: 'keep',
      boundingBox: { x: 45, y: 30, w: 20, h: 12 },
      prompt: ''
    },
    {
      id: 7,
      content: "anymore!",
      font: 'Inter',
      weight: 'Extra Bold',
      spacing: '-0.05em',
      shadow: 'Hard Drop',
      color: '#FFFFFF',
      contrastFeatures: ['High Contrast'],
      type: 'text',
      action: 'keep',
      boundingBox: { x: 30, y: 45, w: 40, h: 15 },
      prompt: ''
    }
  ]
};

interface ThumbnailStudioProps {
  initialImageUrl?: string | null;
  onBack: () => void;
}

// --- Helper Components (Must be Top Level) ---

const ActionTabs = ({ current, onChange, options = ['keep', 'swap', 'new'] }: { current: string, onChange: (val: string) => void, options?: string[] }) => (
  <div 
      className="bg-black/40 p-1 rounded-lg grid gap-1 mt-2"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
  >
    {options.map((opt) => (
      <button
        key={opt}
        onClick={(e) => { e.stopPropagation(); onChange(opt); }}
        className={`
          py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all
          ${current === opt 
            ? 'bg-pink-600 text-white shadow-sm' 
            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
        `}
      >
        {opt === 'new' || opt === 'gen' ? 'Gen AI' : opt}
      </button>
    ))}
  </div>
);

const ContextualInput = ({ item, setter, placeholder, type = 'visual', onBrainstorm, isBrainstorming }: { 
  item: any, setter: any, placeholder: string, type?: 'text' | 'visual', 
  onBrainstorm: (id: string | number, type: 'text' | 'visual', contextStr: string) => void,
  isBrainstorming: string | number | null
}) => {
  const handleInputChange = (val: string) => {
      if (item.type === 'background') setter((prev: any) => ({...prev, prompt: val}));
      else setter((prev: any[]) => prev.map((i: any) => i.id === item.id ? { ...i, prompt: val, content: type === 'text' ? val : i.content } : i));
  };

  if (item.action === 'swap') return (
    <div className="mt-2 animate-in fade-in slide-in-from-top-1">
      <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/20 text-xs text-gray-400 hover:text-white hover:border-pink-500/50 hover:bg-pink-500/5 transition-all">
        <Upload size={12} />
        Upload Reference
      </button>
    </div>
  );
  if (item.action === 'new' || item.action === 'gen' || item.action === 'edit') return (
    <div className="mt-2 animate-in fade-in slide-in-from-top-1 relative">
      <input 
        type="text" 
        value={type === 'text' ? item.content : item.prompt}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/20 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-xs text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50"
      />
      <button 
          onClick={() => onBrainstorm(item.id, type, type === 'text' ? item.content : item.name || 'background')}
          className="absolute right-1 top-1 bottom-1 w-7 flex items-center justify-center text-pink-500 hover:bg-pink-500/10 rounded transition-colors"
          title={type === 'text' ? "✨ Rewrite" : "✨ Brainstorm"}
      >
          {isBrainstorming === item.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
      </button>
    </div>
  );
  return null;
};

const AccordionHeader = ({ title, icon: Icon, sectionId, count, activeSections, toggleSection }: any) => {
  const isOpen = activeSections.includes(sectionId);
  return (
    <button 
      onClick={() => toggleSection(sectionId)}
      className={`w-full flex items-center justify-between p-4 border-b border-white/5 transition-colors ${isOpen ? 'bg-white/5' : 'hover:bg-white/[0.02]'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={14} className={isOpen ? 'text-pink-500' : 'text-gray-400'} />
        <span className={`text-xs font-bold uppercase tracking-wider ${isOpen ? 'text-white' : 'text-gray-400'}`}>
          {title}
        </span>
        {count !== undefined && (
          <span className="bg-white/10 text-gray-400 text-[10px] px-1.5 rounded-full">{count}</span>
        )}
      </div>
      {isOpen ? <ChevronUp size={14} className="text-gray-500"/> : <ChevronDown size={14} className="text-gray-600"/>}
    </button>
  );
};

interface ExpandedStudioProps {
  expandedMode: 'background' | 'subject' | 'prop' | null;
  setExpandedMode: (m: 'background' | 'subject' | 'prop' | null) => void;
  activeExpandedId: string | number | null;
  setActiveExpandedId: (id: string | number | null) => void;
  background: any;
  setBackground: React.Dispatch<React.SetStateAction<any>>;
  subjects: any[];
  setSubjects: React.Dispatch<React.SetStateAction<any[]>>;
  props: any[];
  setProps: React.Dispatch<React.SetStateAction<any[]>>;
}

// --- Expanded Studio Component (Top Level) ---
const ExpandedStudio = ({
  expandedMode, setExpandedMode,
  activeExpandedId, setActiveExpandedId,
  background, setBackground,
  subjects, setSubjects,
  props, setProps
}: ExpandedStudioProps) => {
  const [variations, setVariations] = useState<string[]>([]);
  const [isGeneratingVars, setIsGeneratingVars] = useState(false);
  const [useBrandColors, setUseBrandColors] = useState(true);

  // Determine current item safely
  let currentItem: any = null;
  let setFunction: any = null;

  if (expandedMode === 'background') {
      currentItem = background;
      setFunction = setBackground;
  } else if (expandedMode === 'subject') {
      currentItem = subjects.find(s => s.id === activeExpandedId) || subjects[0];
      setFunction = setSubjects;
  } else if (expandedMode === 'prop') {
      currentItem = props.find(p => p.id === activeExpandedId) || props[0];
      setFunction = setProps;
  }

  const handleUpdate = (key: string, val: any) => {
      if (!currentItem) return;
      if (expandedMode === 'background') {
          setFunction((prev: any) => ({ ...prev, [key]: val }));
      } else {
          setFunction((prev: any[]) => prev.map((item: any) => item.id === currentItem.id ? { ...item, [key]: val } : item));
      }
  };

  const handleGenerateVariations = () => {
      setIsGeneratingVars(true);
      setTimeout(() => {
          const mocks = [
              currentItem?.thumbnail || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&q=80',
              expandedMode === 'subject' ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Var1' : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80',
              expandedMode === 'subject' ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Var2' : 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=150&q=80',
              expandedMode === 'subject' ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Var3' : 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&q=80'
          ];
          setVariations(mocks);
          setIsGeneratingVars(false);
      }, 1500);
  };

  const getChips = () => {
      if (expandedMode === 'subject') return ["Closer to camera", "Strong rim light", "Surprised expression", "Pointing", "YouTube Outline"];
      if (expandedMode === 'prop') return ["Giant scale", "Floating", "Glowing", "3D Render", "Exploding"];
      if (expandedMode === 'background') return ["Blur city", "Neon Studio", "Abstract Gradient", "Speed lines", "Darken"];
      return [];
  };

  const getRecipe = () => {
      if (!currentItem) return "";
      if (expandedMode === 'subject') return `Portrait of ${currentItem.name}, ${currentItem.prompt?.split(',')[1] || 'neutral expr'}, studio lighting.`;
      if (expandedMode === 'prop') return `High quality render of ${currentItem.name}, isolated on white.`;
      if (expandedMode === 'background') return `Background image of ${currentItem.name}, 16:9 aspect ratio.`;
      return "Custom generation recipe.";
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          const url = URL.createObjectURL(file);
          handleUpdate('thumbnail', url);
          handleUpdate('action', 'swap');
      }
  };

  return (
      <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          {!currentItem ? (
              <div className="flex-1 flex items-center justify-center text-white">
                  Item not found. 
                  <button onClick={() => setExpandedMode(null)} className="underline ml-2 text-pink-500 hover:text-pink-400">Close</button>
              </div>
          ) : (
          <>
            {/* Modal Header */}
            <div className="h-16 flex items-center justify-center relative border-b border-white/10 bg-[#0f1115]">
                <div className="flex bg-black/50 p-1 rounded-full border border-white/10">
                    {['subject', 'prop', 'background'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => {
                                setExpandedMode(mode as any);
                                setVariations([]);
                                if (mode === 'subject' && subjects.length) setActiveExpandedId(subjects[0].id);
                                if (mode === 'prop' && props.length) setActiveExpandedId(props[0].id);
                            }}
                            className={`
                                px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2
                                ${expandedMode === mode 
                                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' 
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {mode === 'subject' && <User size={14}/>}
                            {mode === 'prop' && <Package size={14}/>}
                            {mode === 'background' && <ImageIcon size={14}/>}
                            {mode}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={() => { setExpandedMode(null); setActiveExpandedId(null); }}
                    className="absolute right-6 text-gray-500 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Visual Workspace */}
                <div className="flex-1 bg-[#050507] flex flex-col items-center justify-center p-8 relative">
                    <div 
                        className="relative w-full max-w-2xl aspect-video bg-[#0f1115] border border-white/10 rounded-2xl overflow-hidden group flex items-center justify-center shadow-2xl"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {currentItem.thumbnail ? (
                            <img src={currentItem.thumbnail} className="h-full w-full object-contain" alt="preview" />
                        ) : (
                            <div className="text-gray-700 flex flex-col items-center gap-2">
                                <Upload size={40} />
                                <span className="text-sm font-bold">Drag & Drop Reference Image</span>
                            </div>
                        )}
                        
                        <div className="absolute bottom-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-black/60 hover:bg-black/80 text-white backdrop-blur px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-white/10">
                                <Trash2 size={14} className="text-red-500" /> Remove BG
                            </button>
                            <button className="bg-black/60 hover:bg-black/80 text-white backdrop-blur px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-white/10">
                                <RefreshCw size={14} className="text-blue-500" /> Regenerate
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Detail Controls */}
                <div className="w-[400px] bg-[#0f1115] border-l border-white/10 p-6 overflow-y-auto custom-scrollbar flex flex-col">
                    {expandedMode === 'subject' && (
                        <div className="mb-6 flex gap-2">
                            <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-3 text-xs font-bold text-gray-300 flex items-center justify-center gap-2 transition-all">
                                <UserCircle size={16} className="text-pink-500"/> Use Creator Persona
                            </button>
                        </div>
                    )}
                    {expandedMode === 'prop' && (
                        <div className="mb-6 flex gap-2">
                            <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-3 text-xs font-bold text-gray-300 flex items-center justify-center gap-2 transition-all">
                                <Package size={16} className="text-pink-500"/> Upload Product Shot
                            </button>
                        </div>
                    )}

                    <div className="mb-6">
                        <div className="text-[10px] font-mono text-gray-500 mb-2 px-2 border-l-2 border-pink-500/50 italic">
                            Recipe: {getRecipe()}
                        </div>

                        <textarea 
                            value={currentItem.prompt || ''}
                            onChange={(e) => handleUpdate('prompt', e.target.value)}
                            placeholder={`Detailed description of ${currentItem.name}...`}
                            className="w-full h-24 bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:border-pink-500 focus:outline-none placeholder-gray-600"
                        />
                        
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {getChips().map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => handleUpdate('prompt', (currentItem.prompt || '') + `, ${tag}`)}
                                    className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <Plus size={8} /> {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-600 to-orange-500 flex items-center justify-center">
                                <Palette size={12} className="text-white"/>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-200">Brand Kit</span>
                                <span className="text-[10px] text-gray-500">Apply brand colors</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setUseBrandColors(!useBrandColors)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${useBrandColors ? 'bg-pink-600' : 'bg-gray-700'}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${useBrandColors ? 'left-6' : 'left-1'}`}></div>
                        </button>
                    </div>

                    <button 
                        onClick={handleGenerateVariations}
                        disabled={isGeneratingVars}
                        className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mb-6"
                    >
                        {isGeneratingVars ? <Loader2 size={16} className="animate-spin"/> : <Wand2 size={16} />}
                        Generate 4 Options
                    </button>

                    <div className="flex-1 overflow-y-auto">
                        {variations.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-4">
                                {variations.map((v, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleUpdate('thumbnail', v)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative group ${currentItem.thumbnail === v ? 'border-pink-500' : 'border-transparent'}`}
                                    >
                                        <img src={v} className="w-full h-full object-cover" />
                                        {currentItem.thumbnail !== v && (
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm transition-opacity">
                                                Use This
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            !isGeneratingVars && (
                                <div className="h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-600 gap-2">
                                    <Sparkles size={20} className="opacity-50"/>
                                    <span className="text-xs">Variations will appear here</span>
                                </div>
                            )
                        )}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-white/5 text-center">
                        <button onClick={() => { setExpandedMode(null); setActiveExpandedId(null); }} className="text-xs text-gray-500 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors">
                            <FastForward size={12}/> Skip fine-tuning, show composite
                        </button>
                    </div>
                </div>
            </div>
          </>
          )}
      </div>
  );
};

// --- Main Component ---

const ThumbnailStudio = ({ initialImageUrl, onBack }: ThumbnailStudioProps) => {
  const [background, setBackground] = useState(INITIAL_DATA.background);
  const [subjects, setSubjects] = useState(INITIAL_DATA.subjects);
  const [props, setProps] = useState(INITIAL_DATA.props);
  const [texts, setTexts] = useState(INITIAL_DATA.text);
  const [analysis, setAnalysis] = useState(INITIAL_DATA.analysis);
  
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [remixIntensity, setRemixIntensity] = useState(50);
  const [viewMode, setViewMode] = useState('split');
  
  // Expanded Mode State
  const [expandedMode, setExpandedMode] = useState<'background' | 'subject' | 'prop' | null>(null);
  const [activeExpandedId, setActiveExpandedId] = useState<string | number | null>(null);
  
  // AI Loading States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBrainstorming, setIsBrainstorming] = useState<string | number | null>(null);

  // Accordion State
  const [activeSections, setActiveSections] = useState<string[]>(['background', 'subjects', 'text', 'props']);

  useEffect(() => {
    if (initialImageUrl) {
        setBackground(prev => ({
            ...prev,
            thumbnail: initialImageUrl,
            name: 'Imported Image',
            action: 'keep'
        }));
    }
  }, [initialImageUrl]);

  const callGemini = async (prompt: string) => {
    if (!process.env.API_KEY) return "Error: API Key missing";
    if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) await window.aistudio.openSelectKey();
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text || "Error generating content.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Failed to connect to AI.";
    }
  };

  const handleAiAudit = async () => {
    setIsAnalyzing(true);
    const context = `Subjects: ${subjects.map(s => s.name).join(', ')} | Text: "${texts.map(t => t.content).join(' ')}" | Background: ${background.name}`;
    const prompt = `Analyze this YouTube thumbnail CTR potential: ${context}. Return JSON: { "score": 0-100, "summary": "string", "insights": [{ "type": "copy"|"change", "title": "string", "text": "string", "relatedId": 0 }] }`;
    try {
      const result = await callGemini(prompt);
      const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
      setAnalysis(prev => ({ ...prev, ...JSON.parse(cleanJson) }));
    } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
  };

  const handleBrainstorm = async (id: string | number, type: 'text' | 'visual', contextStr: string) => {
    setIsBrainstorming(id);
    const prompt = type === 'text' ? `Viral short thumbnail text for "${contextStr}"` : `High CTR ${contextStr} description`;
    const result = await callGemini(prompt);
    if (type === 'text') setTexts(prev => prev.map(t => t.id === id ? { ...t, content: result.replace(/"/g, '') } : t));
    else {
       if (id === background.id) setBackground(p => ({ ...p, prompt: result }));
       else {
          setSubjects(prev => prev.map(s => s.id === id ? { ...s, prompt: result } : s));
          setProps(prev => prev.map(p => p.id === id ? { ...p, prompt: result } : p));
       }
    }
    setIsBrainstorming(null);
  };

  const updateAction = (setter: any, id: any, newAction: string) => setter((prev: any[]) => prev.map((item: any) => item.id === id ? { ...item, action: newAction } : item));
  const updateBackgroundAction = (newAction: string) => setBackground(prev => ({ ...prev, action: newAction }));
  const toggleSection = (section: string) => setActiveSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);

  const handleAddSubject = () => {
    const id = Date.now();
    setSubjects(prev => [...prev, { id, name: 'New Subject', thumbnail: '', type: 'subject', action: 'gen', boundingBox: { x: 50, y: 20, w: 30, h: 60 }, prompt: 'Portrait of a surprised person' }]);
    if (!activeSections.includes('subjects')) toggleSection('subjects');
  };

  const handleAddProp = () => {
    const id = Date.now();
    setProps(prev => [...prev, { id, name: 'New Prop', icon: <Sparkles size={18} />, type: 'prop', action: 'gen', boundingBox: { x: 50, y: 50, w: 20, h: 20 }, prompt: 'Cool prop' }]);
    if (!activeSections.includes('props')) toggleSection('props');
  };

  const handleDelete = (setter: any, id: any) => {
    setter((prev: any[]) => prev.filter((item: any) => item.id !== id));
    if (hoveredId === id) setHoveredId(null);
  };

  return (
    <div className="h-full bg-[#0f1115] text-white font-sans selection:bg-pink-500 selection:text-white flex flex-col absolute inset-0 z-50">
      
      {expandedMode && (
        <ExpandedStudio 
            expandedMode={expandedMode} 
            setExpandedMode={setExpandedMode}
            activeExpandedId={activeExpandedId} 
            setActiveExpandedId={setActiveExpandedId}
            background={background} 
            setBackground={setBackground}
            subjects={subjects} 
            setSubjects={setSubjects}
            props={props} 
            setProps={setProps}
        />
      )}

      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f1115] z-50 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center font-bold">N</div>
          <span className="font-medium text-gray-200 text-sm">Thumbnail Remix Studio</span>
        </div>
        <div className="flex bg-white/5 rounded-lg p-1">
             <button onClick={() => setViewMode('single')} className={`px-3 py-1 rounded-md text-xs transition-all ${viewMode === 'single' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>Single</button>
             <button onClick={() => setViewMode('split')} className={`px-3 py-1 rounded-md text-xs transition-all ${viewMode === 'split' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>Split</button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-[#050507] relative flex flex-col items-center overflow-y-auto custom-scrollbar">
          <div className="w-full p-8 flex flex-col items-center">
            <div className="relative w-full max-w-4xl aspect-video shadow-2xl rounded-xl overflow-hidden border border-white/10 group bg-gray-900">
              <div className={`absolute inset-0 transition-opacity duration-500 ${background.action === 'keep' ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                 <img src={background.thumbnail} className="w-full h-full object-cover" alt="bg" />
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent"></div>
              </div>

              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="text-center z-20">
                  {texts.map(t => (
                    <div key={t.id} className={`${t.action === 'remove' ? 'opacity-20 line-through decoration-red-500' : ''}`}>
                        <h1 style={{ fontFamily: t.font.includes('Impact') ? 'Impact, sans-serif' : 'Inter, sans-serif', color: t.color, letterSpacing: t.spacing?.includes('-') ? '-0.05em' : 'normal', textShadow: t.shadow !== 'None' ? '2px 2px 10px rgba(0,0,0,0.8)' : 'none', fontWeight: t.weight === 'Extra Bold' ? 800 : 400 }} className={`text-4xl md:text-6xl uppercase leading-none drop-shadow-lg ${t.contrastFeatures?.some(f => f.includes('Red')) ? 'bg-red-600 px-2 transform -rotate-2 inline-block text-white' : ''}`}>
                          {t.content}
                        </h1>
                    </div>
                  ))}
                </div>
              </div>

              {[background, ...subjects, ...props, ...texts].map((item) => {
                if(item.type === 'background' && hoveredId !== item.id) return null;
                const isHovered = hoveredId === item.id;
                return (
                  <div
                    key={item.id}
                    style={{ left: `${item.boundingBox.x}%`, top: `${item.boundingBox.y}%`, width: `${item.boundingBox.w}%`, height: `${item.boundingBox.h}%` }}
                    className={`absolute border-2 transition-all duration-300 rounded-lg pointer-events-none z-30 ${isHovered ? 'border-pink-500 bg-pink-500/10 opacity-100 shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-[1.01]' : 'border-transparent opacity-0'}`}
                  >
                    {isHovered && <span className="absolute -top-7 left-0 bg-pink-600 text-white text-[10px] px-2 py-1 rounded shadow-lg font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2">{item.type}: {item.name || (item as any).content?.substring(0,10)}</span>}
                  </div>
                );
              })}

              {viewMode === 'split' && (
                <div className="absolute inset-0 w-1/2 border-r border-white/20 bg-black/10 backdrop-grayscale-[50%] pointer-events-none z-40 overflow-hidden">
                   <img src={initialImageUrl || background.thumbnail} className="w-full h-full object-cover object-left opacity-60" alt="original" />
                   <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 rounded text-[10px] text-white/50 uppercase tracking-widest font-mono">Original</div>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs font-mono">
               <Move size={12} />
               <span>Hover over lists or analysis cards to locate elements</span>
            </div>
          </div>

          <div className="w-full max-w-4xl px-8 pb-12">
             <div className="bg-[#0f1115] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={120} /></div>
                <div className="flex items-start gap-8 mb-8 relative z-10">
                   <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="42" stroke="#1f2937" strokeWidth="8" fill="transparent" />
                          <circle cx="48" cy="48" r="42" stroke={isAnalyzing ? '#374151' : '#db2777'} strokeWidth="8" fill="transparent" strokeDasharray={264} strokeDashoffset={264 - (264 * analysis.score) / 100} strokeLinecap="round" className={`transition-all duration-1000 ${isAnalyzing ? 'animate-pulse opacity-50' : ''}`} />
                        </svg>
                        <div className="absolute flex flex-col items-center"><span className="text-3xl font-black text-white">{isAnalyzing ? '--' : analysis.score}</span></div>
                      </div>
                      <button onClick={handleAiAudit} disabled={isAnalyzing} className="flex items-center gap-1 text-[10px] font-bold text-pink-500 hover:text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full transition-all hover:bg-pink-500/20 disabled:opacity-50">
                        {isAnalyzing ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />} {isAnalyzing ? 'Analyzing...' : 'AI Audit'}
                      </button>
                   </div>

                   <div className="flex-1 pt-2">
                      <h3 className="text-lg font-bold text-white mb-2">{isAnalyzing ? 'Gemini is reviewing your thumbnail...' : 'Analysis Complete'}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{isAnalyzing ? 'Analyzing subjects, facial expressions, and text contrast against current viral trends...' : analysis.summary}</p>
                      {!isAnalyzing && (
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full"><Zap size={12} className="text-yellow-400" /><span>CTR Projection: <span className="text-white font-mono">{(analysis.score / 7.4).toFixed(1)}%</span></span></div>
                          </div>
                      )}
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   {isAnalyzing ? ([1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse"></div>)) : (
                      analysis.insights.map((insight: any, idx: number) => (
                          <div key={idx} onMouseEnter={() => setHoveredId(insight.relatedId)} onMouseLeave={() => setHoveredId(null)} className={`p-4 rounded-xl border bg-white/[0.02] transition-all cursor-default relative group flex items-start gap-4 ${insight.type === 'copy' ? 'border-green-500/20 hover:bg-green-500/5 hover:border-green-500/40' : insight.type === 'change' ? 'border-orange-500/20 hover:bg-orange-500/5 hover:border-orange-500/40' : 'border-purple-500/20 hover:bg-purple-500/5 hover:border-purple-500/40'}`}>
                             <div className={`p-2 rounded-lg flex-shrink-0 ${insight.type === 'copy' ? 'bg-green-500/10 text-green-400' : insight.type === 'change' ? 'bg-orange-500/10 text-orange-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                {insight.type === 'copy' && <CheckCircle2 size={20} />}
                                {insight.type === 'change' && <AlertCircle size={20} />}
                                {insight.type === 'creative' && <Lightbulb size={20} />}
                             </div>
                             <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                   <span className={`text-xs font-bold uppercase tracking-wider ${insight.type === 'copy' ? 'text-green-400' : insight.type === 'change' ? 'text-orange-400' : 'text-purple-400'}`}>{insight.type === 'copy' ? 'Keep' : insight.type === 'change' ? 'Fix' : 'Remix'}</span>
                                   <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors flex items-center gap-1"><span className="opacity-0 group-hover:opacity-100 transition-opacity">Highlight</span><Move size={12} /></span>
                                </div>
                                <h4 className="text-sm font-medium text-gray-200 mb-1">{insight.title}</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">{insight.text}</p>
                             </div>
                          </div>
                      ))
                   )}
                </div>
             </div>
          </div>
        </div>

        <aside className="w-[340px] bg-[#0f1115] border-l border-white/10 flex flex-col overflow-y-auto custom-scrollbar pb-20 z-40 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Remix Intensity</span>
              <span className="text-[10px] text-pink-400 font-mono">{remixIntensity}%</span>
            </div>
            <input type="range" min="0" max="100" value={remixIntensity} onChange={(e) => setRemixIntensity(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-600" />
            <p className="text-[10px] text-gray-500 mt-3 leading-relaxed border-t border-white/5 pt-2">Controls how much the AI deviates from the original composition.</p>
          </div>

          <AccordionHeader title="Background" icon={ImageIcon} sectionId="background" activeSections={activeSections} toggleSection={toggleSection} />
          {activeSections.includes('background') && (
             <div className="p-4 bg-black/20 border-b border-white/5 animate-in slide-in-from-top-2 duration-200" onMouseEnter={() => setHoveredId(background.id)} onMouseLeave={() => setHoveredId(null)}>
                <div className="bg-[#16181d] rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all relative group">
                   <div className="flex items-center gap-3 mb-2">
                      <img src={background.thumbnail} className="w-12 h-8 object-cover rounded border border-white/10" alt="bg" />
                      <div className="flex-1">
                        <div className="text-xs text-white font-medium truncate">{background.name}</div>
                        <div className="text-[10px] text-gray-500">1920x1080 • HQ</div>
                      </div>
                      <button onClick={() => { setExpandedMode('background'); setActiveExpandedId(background.id); }} className="text-gray-500 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors" title="Expand for details"><Maximize2 size={14} /></button>
                   </div>
                   <ActionTabs current={background.action} onChange={updateBackgroundAction} options={['keep', 'swap', 'gen']}/>
                   <ContextualInput item={background} setter={setBackground} placeholder="Describe new background..." onBrainstorm={handleBrainstorm} isBrainstorming={isBrainstorming}/>
                </div>
             </div>
          )}

          <AccordionHeader title="Subjects" icon={User} sectionId="subjects" count={subjects.length} activeSections={activeSections} toggleSection={toggleSection} />
          {activeSections.includes('subjects') && (
             <div className="p-4 bg-black/20 border-b border-white/5 animate-in slide-in-from-top-2 duration-200 space-y-3">
                {subjects.length === 0 && <div className="text-xs text-gray-500 text-center">No subjects detected</div>}
                {subjects.map(s => (
                  <div key={s.id} onMouseEnter={() => setHoveredId(s.id)} onMouseLeave={() => setHoveredId(null)} className={`bg-[#16181d] rounded-xl p-3 border transition-all ${hoveredId === s.id ? 'border-pink-500/50' : 'border-white/5'}`}>
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3">
                          {s.thumbnail ? <img src={s.thumbnail} className="w-8 h-8 rounded-full bg-gray-700 object-cover" alt={s.name}/> : <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400"><User size={14} /></div>}
                          <div className="text-xs font-medium">{s.name}</div>
                       </div>
                       <div className="flex items-center gap-1">
                           <button onClick={(e) => { e.stopPropagation(); setExpandedMode('subject'); setActiveExpandedId(s.id); }} className="text-gray-600 hover:text-white p-1 transition-colors"><Maximize2 size={12} /></button>
                           <button onClick={(e) => { e.stopPropagation(); handleDelete(setSubjects, s.id); }} className="text-gray-600 hover:text-red-500 transition-colors p-1"><Trash2 size={12} /></button>
                       </div>
                    </div>
                    <ActionTabs current={s.action} onChange={(val) => updateAction(setSubjects, s.id, val)} options={s.name.includes('New') ? ['gen', 'swap'] : ['keep', 'swap', 'gen']} />
                    <ContextualInput item={s} setter={setSubjects} placeholder="Describe character..." onBrainstorm={handleBrainstorm} isBrainstorming={isBrainstorming} />
                    <div className="mt-3 pt-2 border-t border-white/5">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>Scale</span><span>{(s.boundingBox.w * 2).toFixed(0)}%</span></div>
                        <input type="range" min="10" max="50" value={s.boundingBox.w} onChange={(e) => { const val = parseInt(e.target.value); setSubjects(prev => prev.map(sub => sub.id === s.id ? {...sub, boundingBox: {...sub.boundingBox, w: val}} : sub)) }} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-gray-500 hover:accent-white" />
                    </div>
                  </div>
                ))}
                <button onClick={handleAddSubject} className="w-full py-3 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"><Plus size={14} /> Add Subject</button>
             </div>
          )}

          <AccordionHeader title="Text Overlay" icon={Type} sectionId="text" count={texts.length} activeSections={activeSections} toggleSection={toggleSection} />
          {activeSections.includes('text') && (
             <div className="p-4 bg-black/20 border-b border-white/5 animate-in slide-in-from-top-2 duration-200 space-y-3">
                {texts.map(t => (
                  <div key={t.id} onMouseEnter={() => setHoveredId(t.id)} onMouseLeave={() => setHoveredId(null)} className={`bg-[#16181d] rounded-xl p-3 border transition-all ${hoveredId === t.id ? 'border-pink-500/50' : 'border-white/5'}`}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 font-serif text-lg font-bold border border-white/10">T</div>
                      <div className="flex-1">
                        <div className="text-xs text-white font-medium truncate">"{t.content}"</div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                           <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 flex items-center gap-1"><Type size={8} /> {t.font}</span>
                        </div>
                      </div>
                    </div>
                    <ActionTabs current={t.action} onChange={(val) => updateAction(setTexts, t.id, val)} options={['keep', 'edit', 'remove']} />
                    <ContextualInput item={t} setter={setTexts} placeholder="Enter text..." type="text" onBrainstorm={handleBrainstorm} isBrainstorming={isBrainstorming} />
                  </div>
                ))}
             </div>
          )}

          <AccordionHeader title="Props & Elements" icon={Layers} sectionId="props" count={props.length} activeSections={activeSections} toggleSection={toggleSection} />
          {activeSections.includes('props') && (
             <div className="p-4 bg-black/20 border-b border-white/5 animate-in slide-in-from-top-2 duration-200 space-y-3">
               {props.length === 0 && <div className="text-xs text-gray-500 text-center">No props detected</div>}
               {props.map(p => (
                  <div key={p.id} onMouseEnter={() => setHoveredId(p.id)} onMouseLeave={() => setHoveredId(null)} className={`bg-[#16181d] rounded-xl p-3 border transition-all ${hoveredId === p.id ? 'border-pink-500/50' : 'border-white/5'}`}>
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-pink-400">{p.icon}</div>
                          <div className="text-xs font-medium">{p.name}</div>
                       </div>
                       <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); setExpandedMode('prop'); setActiveExpandedId(p.id); }} className="text-gray-600 hover:text-white p-1 transition-colors"><Maximize2 size={12} /></button>
                           <button onClick={(e) => { e.stopPropagation(); handleDelete(setProps, p.id); }} className="text-gray-600 hover:text-red-500 transition-colors p-1"><Trash2 size={12} /></button>
                       </div>
                    </div>
                    <ActionTabs current={p.action} onChange={(val) => updateAction(setProps, p.id, val)} options={p.name.includes('New') ? ['gen', 'swap'] : ['keep', 'swap', 'gen']} />
                    <ContextualInput item={p} setter={setProps} placeholder="Describe object..." onBrainstorm={handleBrainstorm} isBrainstorming={isBrainstorming} />
                  </div>
                ))}
                <button onClick={handleAddProp} className="w-full py-3 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"><Plus size={14} /> Add Prop</button>
             </div>
          )}
        </aside>
      </main>

      <footer className="h-16 border-t border-white/10 bg-[#0f1115] flex items-center justify-between px-8 z-50 relative">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"><ChevronLeft size={18} /> Back</button>
        <button className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-2.5 rounded-full font-medium shadow-lg shadow-pink-900/20 transition-all transform hover:scale-[1.02]"><span>Generate Remix</span><Wand2 size={16} /></button>
      </footer>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #0f1115; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2d35; border-radius: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3a3d45; }`}</style>
    </div>
  );
};

export default ThumbnailStudio;

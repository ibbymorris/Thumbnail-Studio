
import React from 'react';
import { WizardMode, Emotion, RemixAnalysis } from '../../types';
import { Card } from '../ui/Shared';
import { FaceIcon, TrendingIcon } from '../icons';

// Consistent character style - deep close ups
const expressionPresets: { id: Emotion, label: string, imageUrl: string }[] = [
    { id: 'surprised', label: 'Shocked', imageUrl: 'https://res.cloudinary.com/ditco4c8e/image/upload/v1763674203/xvJj8x5wW32YkbfS5Uh5w_hgfpaq.jpg' },
    { id: 'fearful', label: 'Fear', imageUrl: 'https://res.cloudinary.com/ditco4c8e/image/upload/v1763674203/9VEfD9LGi-TiE41uRwWr9_yvtawk.jpg' },
    { id: 'happy', label: 'Joy', imageUrl: 'https://res.cloudinary.com/ditco4c8e/image/upload/v1763674203/T7RS1CfQpSCQG6UF38KUD_gl5qhz.jpg' },
    { id: 'serious', label: 'Focused', imageUrl: 'https://res.cloudinary.com/ditco4c8e/image/upload/v1763674203/6x3br9XNB1ANYVKVJfPBZ_vzouzw.jpg' },
    { id: 'angry', label: 'Angry', imageUrl: 'https://res.cloudinary.com/ditco4c8e/image/upload/v1763674203/kcL2znT8WhAciIDpeGHxM_gvxr5h.jpg' },
    { id: 'disgusted', label: 'Disgusted', imageUrl: 'https://res.cloudinary.com/ditco4c8e/image/upload/v1763674203/34aAOCU-4vui198HMVGrP_ougb5u.jpg' },
];

interface Props {
    mode: WizardMode;
    emotion: Emotion | undefined;
    setEmotion: (e: Emotion | undefined) => void;
    emotionIntensity: number;
    setEmotionIntensity: (n: number) => void;
    posePrompt: string;
    setPosePrompt: (s: string) => void;
    remixAnalysis?: RemixAnalysis | null;
}

export const StepAction = ({ mode, emotion, setEmotion, emotionIntensity, setEmotionIntensity, posePrompt, setPosePrompt, remixAnalysis }: Props) => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold font-['Space_Grotesk']">Direct the Action</h2>
                <p className="text-gray-400">Control expression and pose.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                 {/* Pose */}
                 <Card className="h-full space-y-4">
                     <div className="flex items-center gap-2 text-[#ff0000] mb-2">
                         <FaceIcon className="size-5" />
                         <h3 className="text-sm font-bold uppercase tracking-wider">AI Pose Director</h3>
                     </div>
                     <div className="relative">
                         <input 
                             type="text"
                             value={posePrompt}
                             onChange={(e) => setPosePrompt(e.target.value)}
                             placeholder="e.g. Shrugging shoulders..."
                             className="w-full bg-[#0b0b0b] border border-[#ffffff1a] rounded-xl p-4 text-white placeholder-gray-600 focus:border-[#ff0000] outline-none"
                         />
                     </div>
                     <div className="bg-[#1c1e20] border border-[#ffffff0d] rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-3">Common Poses</p>
                        <div className="flex flex-wrap gap-2">
                            {['Pointing', 'Hands on Head', 'Shrugging', 'Holding Object', 'Arms Crossed'].map(pose => (
                                <button 
                                    key={pose}
                                    onClick={() => setPosePrompt(pose)}
                                    className="px-3 py-1.5 rounded-lg bg-[#0b0b0b] border border-[#ffffff1a] text-xs text-gray-300 hover:text-white hover:border-[#ff0000] transition-colors"
                                >
                                    {pose}
                                </button>
                            ))}
                        </div>
                     </div>
                 </Card>

                 {/* Emotion */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#ff0000] mb-2">
                         <TrendingIcon className="size-5" />
                         <h3 className="text-sm font-bold uppercase tracking-wider">Emotion Tuner</h3>
                     </div>
                     
                     {mode === 'remix' && remixAnalysis?.detectedEmotion && (
                        <div className="text-xs text-purple-400 bg-purple-900/20 p-2 rounded border border-purple-500/20 mb-2">
                            Detected Emotion: <b className="uppercase">{remixAnalysis.detectedEmotion}</b>
                        </div>
                     )}

                    <div className="grid grid-cols-3 gap-3">
                         {expressionPresets.map(exp => (
                             <button 
                                 key={exp.id}
                                 onClick={() => setEmotion(emotion === exp.id ? undefined : exp.id)}
                                 className={`group relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300 border-2 ${emotion === exp.id ? 'border-[#ff0000] shadow-lg shadow-red-900/40 scale-105' : 'border-transparent hover:border-white/20'}`}
                             >
                                 <img 
                                    src={exp.imageUrl} 
                                    className="w-full h-full object-cover object-[center_20%] scale-125 transition-transform duration-500 group-hover:scale-135" 
                                    alt={exp.label} 
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-2">
                                     <span className={`text-[10px] font-bold uppercase tracking-wide ${emotion === exp.id ? 'text-[#ff0000]' : 'text-white'}`}>{exp.label}</span>
                                 </div>
                             </button>
                         ))}
                     </div>

                     <Card className="p-4">
                         <div className="flex justify-between mb-2">
                             <label className="text-xs font-bold text-gray-400 uppercase">Intensity</label>
                             <span className="text-xs font-bold text-[#ff0000]">{emotionIntensity}%</span>
                         </div>
                         <input 
                             type="range" 
                             min="0" 
                             max="100" 
                             value={emotionIntensity}
                             onChange={(e) => setEmotionIntensity(parseInt(e.target.value))}
                             className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#ff0000]"
                         />
                     </Card>
                 </div>
            </div>
        </div>
    );
};

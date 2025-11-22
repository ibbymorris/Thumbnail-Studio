
import React from 'react';
import { WizardMode, CompositionType } from '../../types';
import { Card } from '../ui/Shared';
import { LayoutRightIcon, LayoutLeftIcon, LayoutCenterIcon, LayoutSplitIcon, CheckIcon } from '../icons';

interface Props {
    mode: WizardMode;
    composition: CompositionType;
    setComposition: (c: CompositionType) => void;
}

export const StepComposition = ({ mode, composition, setComposition }: Props) => {
    
    const compositions: { id: CompositionType, title: string, desc: string, icon: any }[] = [
        { 
            id: 'classic-right', 
            title: 'Classic Face Right', 
            desc: 'Subject on right, text on left. The industry standard.', 
            icon: LayoutRightIcon 
        },
        { 
            id: 'classic-left', 
            title: 'Classic Face Left', 
            desc: 'Subject on left, text on right. Standard flip.', 
            icon: LayoutLeftIcon 
        },
        { 
            id: 'versus', 
            title: 'Split Screen / Versus', 
            desc: 'Comparing two subjects or items. High contrast divide.', 
            icon: LayoutSplitIcon 
        },
        { 
            id: 'object-center', 
            title: 'Object Focus', 
            desc: 'Prop is the hero in center. Subject peeks from behind.', 
            icon: LayoutCenterIcon 
        },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold font-['Space_Grotesk']">Direct the Action</h2>
                <p className="text-gray-400">Choose how the action unfolds.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {compositions.map((layout) => {
                    const Icon = layout.icon;
                    const isSelected = composition === layout.id;
                    return (
                        <div 
                            key={layout.id}
                            onClick={() => setComposition(layout.id)}
                            className={`
                                relative group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                                ${isSelected 
                                    ? 'bg-[#1c1e20] border-[#ff0000] shadow-lg shadow-red-900/20' 
                                    : 'bg-[#1c1e20]/50 border-[#ffffff1a] hover:bg-[#1c1e20] hover:border-white/30'}
                            `}
                        >
                            <div className="flex items-start gap-6">
                                <div className={`p-3 rounded-xl transition-colors ${isSelected ? 'bg-[#ff0000]/10 text-[#ff0000]' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                    <Icon className="w-12 h-12" />
                                </div>
                                
                                <div>
                                    <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                        {layout.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {layout.desc}
                                    </p>
                                </div>
                            </div>

                            {isSelected && (
                                <div className="absolute top-4 right-4">
                                    <div className="w-6 h-6 rounded-full bg-[#ff0000] flex items-center justify-center">
                                        <CheckIcon className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Visual Guide / Hint */}
            <Card className="p-6 bg-blue-900/10 border-blue-500/20 flex items-start gap-4">
                <div className="text-blue-400 pt-1">ℹ️</div>
                <div>
                    <h4 className="text-sm font-bold text-blue-200 mb-1">Why does this matter?</h4>
                    <p className="text-xs text-blue-300/70 leading-relaxed">
                        Without a composition guide, AI often floats objects randomly. Defining a layout ensures your text has negative space (empty area) to sit on, and your subject makes eye contact in the right direction.
                    </p>
                </div>
            </Card>
        </div>
    );
};

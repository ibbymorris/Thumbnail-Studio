
import React from 'react';
import { RemixAnalysis, RemixConfig } from '../../types';
import { Card, Badge } from '../ui/Shared';

interface Props {
    analysis: RemixAnalysis | null;
    config: RemixConfig | null;
    updateConfig: (updates: Partial<RemixConfig>) => void;
}

export const StepRemixAnalysis = ({ analysis, config, updateConfig }: Props) => {
    if (!analysis || !config) return <div className="text-center text-gray-500 animate-pulse">Analyzing image...</div>;

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Left: Original */}
            <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold text-white">Original</h3>
                <img src={analysis.originalUrl} alt="Original" className="w-full rounded-2xl border border-white/10" />
                
                <div className="bg-[#1c1e20] p-4 rounded-2xl border border-white/10 space-y-4">
                    <h4 className="font-bold text-sm text-gray-400 uppercase">Global Remix Settings</h4>
                    <div>
                        <label className="text-xs text-gray-500 block mb-2">Remix Intensity</label>
                        <input type="range" className="w-full accent-red-600" />
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                            <span>Subtle</span>
                            <span>Wild</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Detected Elements */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Detected Elements</h3>
                    <Badge variant="accent">AI Analysis Complete</Badge>
                </div>

                {/* Subjects */}
                <section className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-500 uppercase">Main Subjects</h4>
                    {analysis.subjects.map(sub => (
                        <Card key={sub.id} className="flex items-center gap-4 p-4">
                            <img src={sub.thumbnailUrl} className="w-16 h-16 rounded-lg object-cover bg-black" alt={sub.name} />
                            <div className="flex-grow">
                                <div className="font-bold text-white">{sub.name}</div>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                        <input type="radio" name={`sub_${sub.id}`} defaultChecked className="accent-red-600"/> Keep
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                        <input type="radio" name={`sub_${sub.id}`} className="accent-red-600"/> Swap Face
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                        <input type="radio" name={`sub_${sub.id}`} className="accent-red-600"/> New Character
                                    </label>
                                </div>
                            </div>
                        </Card>
                    ))}
                </section>

                {/* Props */}
                <section className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-500 uppercase">Props</h4>
                    {analysis.props.map(prop => (
                        <Card key={prop.id} className="flex items-center gap-4 p-3">
                            <img src={prop.thumbnailUrl} className="w-12 h-12 rounded object-cover bg-black" alt={prop.label}/>
                            <div className="flex-grow flex items-center justify-between">
                                <span className="text-gray-200">{prop.label}</span>
                                <div className="flex gap-3 text-sm">
                                    <label className="flex items-center gap-1 text-gray-400"><input type="checkbox" defaultChecked className="accent-red-600"/> Keep</label>
                                    <label className="flex items-center gap-1 text-gray-400"><input type="checkbox" className="accent-red-600"/> Remove</label>
                                </div>
                            </div>
                        </Card>
                    ))}
                    <button className="text-xs font-bold text-red-500 hover:text-red-400">+ Add new prop</button>
                </section>

                 {/* Background */}
                 <section className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-500 uppercase">Background</h4>
                    <Card className="p-4">
                        <div className="flex gap-4">
                            {analysis.background && <img src={analysis.background.thumbnailUrl} className="w-24 h-16 rounded object-cover" alt="bg" />}
                            <div className="space-y-2 flex-grow">
                                <div className="flex gap-4 text-sm">
                                    <label className="text-gray-300"><input type="radio" name="bg" defaultChecked className="accent-red-600"/> Keep Existing</label>
                                    <label className="text-gray-300"><input type="radio" name="bg" className="accent-red-600"/> Blur More</label>
                                    <label className="text-gray-300"><input type="radio" name="bg" className="accent-red-600"/> Swap</label>
                                </div>
                                <select className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-gray-300 w-full outline-none">
                                    <option>Studio Lighting</option>
                                    <option>Neon City</option>
                                    <option>Abstract Gradient</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
};

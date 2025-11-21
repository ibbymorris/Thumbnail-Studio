
import React from 'react';
import { WizardMode, RemixAnalysis, FileWithPreview } from '../../types';
import { AssetCard } from '../AssetCard';
import { FaceIcon, StarIcon, SketchIcon } from '../icons';

interface Props {
    mode: WizardMode;
    remixAnalysis?: RemixAnalysis | null;
    // Asset States
    subjectMode: 'upload' | 'generate'; setSubjectMode: any;
    subjectImage: FileWithPreview | null; setSubjectImage: any;
    subjectGenPrompt: string; setSubjectGenPrompt: any;
    
    propMode: 'upload' | 'generate'; setPropMode: any;
    propImage: FileWithPreview | null; setPropImage: any;
    propGenPrompt: string; setPropGenPrompt: any;

    bgMode: 'upload' | 'generate'; setBgMode: any;
    bgImage: FileWithPreview | null; setBgImage: any;
    bgGenPrompt: string; setBgGenPrompt: any;

    handleFile: (e: any, setter: any) => void;
    subjectRef: any; propRef: any; bgRef: any;
}

export const StepStage = (props: Props) => {
    const { mode, remixAnalysis } = props;
    const isRemix = mode === 'remix' && remixAnalysis;

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold font-['Space_Grotesk']">Set the Stage</h2>
                <p className="text-gray-400">Refine your main assets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Subject Card */}
                <AssetCard 
                    type="subject"
                    title="Main Subject" 
                    description="The Hero. The main focus of the video. e.g. A Person, Avatar, or a specific Product (like a phone in a review)."
                    icon={<FaceIcon className="size-5"/>}
                    mode={props.subjectMode} setMode={props.setSubjectMode}
                    image={props.subjectImage} setImage={props.setSubjectImage}
                    genPrompt={props.subjectGenPrompt} setGenPrompt={props.setSubjectGenPrompt}
                    placeholderUrl={isRemix ? remixAnalysis?.subjects[0]?.thumbnailUrl || '' : "https://res.cloudinary.com/ditco4c8e/image/upload/v1763648988/Mr_Beast_nraatg.png"}
                    fileInputRef={props.subjectRef}
                    handleFile={(e) => props.handleFile(e, props.setSubjectImage)}
                    isRemix={!!isRemix}
                />

                {/* Prop Card */}
                <AssetCard 
                    type="prop"
                    title="Key Prop" 
                    description="Story elements. Objects that add context or intrigue. e.g. Stack of Cash, Gaming Controller, Mystery Box, or Arrows."
                    icon={<StarIcon className="size-5"/>}
                    mode={props.propMode} setMode={props.setPropMode}
                    image={props.propImage} setImage={props.setPropImage}
                    genPrompt={props.propGenPrompt} setGenPrompt={props.setPropGenPrompt}
                    placeholderUrl={isRemix ? remixAnalysis?.props[0]?.thumbnailUrl || '' : "https://res.cloudinary.com/ditco4c8e/image/upload/v1763651949/Jet_Ski_qcdkct.png"}
                    fileInputRef={props.propRef}
                    handleFile={(e) => props.handleFile(e, props.setPropImage)}
                    isRemix={!!isRemix}
                />

                {/* Background Card */}
                <AssetCard 
                    type="background"
                    title="Background" 
                    description="The Vibe. The setting behind the hero. e.g. Blurred Studio, Neon Gaming Room, City Street, or Abstract Gradient."
                    icon={<SketchIcon className="size-5"/>}
                    mode={props.bgMode} setMode={props.setBgMode}
                    image={props.bgImage} setImage={props.setBgImage}
                    genPrompt={props.bgGenPrompt} setGenPrompt={props.setBgGenPrompt}
                    placeholderUrl={isRemix ? remixAnalysis?.background?.thumbnailUrl || '' : "https://res.cloudinary.com/ditco4c8e/image/upload/v1763652090/pexels-asadphoto-1430677_abqwnf.jpg"}
                    fileInputRef={props.bgRef}
                    handleFile={(e) => props.handleFile(e, props.setBgImage)}
                    isRemix={!!isRemix}
                />
            </div>
        </div>
    );
};

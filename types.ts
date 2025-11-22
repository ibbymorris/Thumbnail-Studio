
import React from 'react';

export type ToolType = 'generator' | 'face-fixer' | 'style-transfer';
export type ThumbnailStyle = 'reaction' | 'gaming' | 'minimalist' | 'tech' | 'vlog' | 'cinematic';
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type Emotion = 'surprised' | 'happy' | 'angry' | 'serious' | 'confused' | 'neutral' | 'fearful' | 'laughing' | 'disgusted' | 'skeptical' | 'sad' | 'tired';
export type CompositionType = 'classic-right' | 'classic-left' | 'versus' | 'object-center' | 'cinematic-wide';
export type VariantStrategy = 'emotion' | 'background' | 'color' | 'mix' | 'none';

export interface FileWithPreview extends File {
  preview: string;
  source?: 'ai' | 'upload';
}

export interface ToolData {
  id: ToolType;
  title: string;
  description: string;
  imageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  isNew?: boolean;
  poweredBy?: boolean;
}

export interface BrandKit {
  primaryColor: string;
  fontStyle: 'bold' | 'handwritten' | 'modern' | 'serif';
}

// Wizard Types
export type WizardMode = 'fromScratch' | 'remix';
// Removed 'action' as it is merged into 'stage'
export type WizardStep = 'idea' | 'remixAnalysis' | 'stage' | 'composition' | 'polish';

// Remix Analysis Data (Mocked API Response)
export interface RemixAnalysis {
  originalUrl: string;
  subjects: { id: string; name: string; thumbnailUrl: string; box_2d?: [number, number, number, number] }[];
  props: { id: string; label: string; thumbnailUrl: string; box_2d?: [number, number, number, number] }[];
  background: { id: string; thumbnailUrl: string; label?: string } | null;
  textBoxes: { id: string; content: string; position: 'top' | 'middle' | 'bottom' }[];
  detectedEmotion?: Emotion;
}

// User Choices for Remix
export interface RemixConfig {
  subjects: Record<string, {
    keep: boolean;
    swapFace?: boolean;
    newFaceSource?: 'upload' | 'url' | 'avatar';
    emotion?: string;
    characterPrompt?: string;
  }>;
  props: Record<string, {
    keep: boolean;
    swapPrompt?: string;
    remove?: boolean;
  }>;
  addedProps: { id: string; prompt: string }[];
  background: {
    strategy: 'keep' | 'blurMore' | 'swap';
    style?: string;
    customPrompt?: string;
    matchBrandColors?: boolean;
  };
  textOverrides: Record<string, { content: string }>;
  remixIntensity: 'subtle' | 'low' | 'medium' | 'high' | 'wild';
}

// Copilot Context
export interface ThumbCopilotContext {
  step: WizardStep;
  mode: WizardMode;
  videoTitle?: string;
  overlayText?: string;
  remixAnalysis?: RemixAnalysis | null;
  remixConfig?: RemixConfig | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: {
      label: string;
      action: () => void;
  }[];
}

export interface GenerationConfig {
  prompt: string;
  // Deprecated generic image slot
  imageBytes?: string; 
  mimeType?: string;
  
  // Specific Workflow Assets
  remixImageBytes?: string;
  backgroundImageBytes?: string;
  subjectImageBytes?: string;
  propImageBytes?: string;
  poseImageBytes?: string;
  
  overlayText?: string;
  style?: string;
  aspectRatio: AspectRatio;
  emotion?: Emotion;
  emotionIntensity?: number;
  pose?: string;
  composition?: CompositionType; // New composition field
  brandKit?: BrandKit;
  elements?: string[];
  
  // Polish Options
  variantStrategy?: VariantStrategy;
  generateShorts?: boolean;
}

export interface InspirationItem {
  id: string;
  title: string;
  imageUrl: string;
  views: string;
  style: ThumbnailStyle;
  promptTemplate: string;
}

// --- Studio / Canvas Types ---

export interface Layer {
  id: string;
  type: 'image' | 'text' | 'background' | 'subject' | 'prop';
  content: string; // Image URL or Text content
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  zIndex: number;
  name: string;
  locked?: boolean;
  opacity?: number;
  // AI Metadata
  prompt?: string;
  emotion?: {
    joy: number;
    shock: number;
    anger: number;
  };
}

export interface CanvasState {
  layers: Layer[];
  selectedLayerId: string | null;
  backgroundColor: string;
  aspectRatio: AspectRatio;
}

// --- Persona Types ---
export interface Persona {
  id: string;
  name: string;
  thumbnailUrl: string;
  images: string[]; // Array of base64 strings or URLs
}
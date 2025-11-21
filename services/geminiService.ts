
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { GenerationConfig, RemixAnalysis } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const dataUrlToBase64 = (dataUrl: string): string => {
    return dataUrl.split(',')[1];
};

export const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

export async function analyzeImage(base64Image: string): Promise<RemixAnalysis> {
  if (!process.env.API_KEY) {
    throw new Error("API key not found.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Analyze this YouTube thumbnail image and provide a structured analysis for a remixing tool.
  Identify the following elements:
  1. Main Subjects: People or main characters. Give them a short name (e.g. "MrBeast", "Shocked Gamer"). Also provide the bounding box (ymin, xmin, ymax, xmax).
  2. Props: Key objects visible (e.g. "iPhone", "Stack of Money", "Car"). Also provide the bounding box (ymin, xmin, ymax, xmax).
  3. Background: Describe the setting (e.g. "Blue Gradient", "City Street").
  4. Text: Any visible text overlays.
  5. Emotion: The overall facial expression/vibe (e.g. "surprised", "happy").

  Return ONLY raw JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  box_2d: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: "Bounding box [ymin, xmin, ymax, xmax]"
                  }
                }
              }
            },
            props: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  box_2d: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: "Bounding box [ymin, xmin, ymax, xmax]"
                  }
                }
              }
            },
            background: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING }
              }
            },
            textBoxes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  content: { type: Type.STRING },
                  position: { type: Type.STRING, enum: ['top', 'middle', 'bottom'] }
                }
              }
            },
            detectedEmotion: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis returned");
    
    const data = JSON.parse(text);
    
    // We return detected data. Thumbnails will be generated via cropping in the UI layer using box_2d
    return {
        originalUrl: '', // Set by caller
        subjects: data.subjects?.map((s: any, i: number) => ({ ...s, id: `sub_${i}`, thumbnailUrl: '' })) || [],
        props: data.props?.map((p: any, i: number) => ({ ...p, id: `prop_${i}`, thumbnailUrl: '' })) || [],
        background: data.background ? { ...data.background, id: 'bg_1', thumbnailUrl: '' } : null,
        textBoxes: data.textBoxes || [],
        detectedEmotion: data.detectedEmotion?.toLowerCase()
    };

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
}

// Helper to crop an image from base64 using normalized coordinates [ymin, xmin, ymax, xmax]
export const cropImageFromBase64 = async (base64Image: string, box: [number, number, number, number]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const [ymin, xmin, ymax, xmax] = box;
      
      const canvas = document.createElement('canvas');
      const width = img.width;
      const height = img.height;
      
      // Add 10% padding to context for better extraction
      const padX = (xmax - xmin) * 0.1;
      const padY = (ymax - ymin) * 0.1;

      const safeXmin = Math.max(0, xmin - padX);
      const safeYmin = Math.max(0, ymin - padY);
      const safeXmax = Math.min(1, xmax + padX);
      const safeYmax = Math.min(1, ymax + padY);
      
      const cropX = safeXmin * width;
      const cropY = safeYmin * height;
      const cropWidth = (safeXmax - safeXmin) * width;
      const cropHeight = (safeYmax - safeYmin) * height;
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      resolve(canvas.toDataURL().split(',')[1]); // Return base64 content
    };
    img.onerror = reject;
    img.src = `data:image/png;base64,${base64Image}`;
  });
};

export async function extractElement(base64Image: string, objectName: string): Promise<string> {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Isolate the ${objectName} from this image. Remove the background completely and place the subject on a solid white background. High precision cutout.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/png', data: base64Image } }
            ]
        },
        config: { responseModalities: [Modality.IMAGE] }
    });
    
    const generatedPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (generatedPart?.inlineData?.data) {
        return `data:image/png;base64,${generatedPart.inlineData.data}`;
    }
    throw new Error("Failed to extract element");
}

export async function removeForeground(base64Image: string): Promise<string> {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Remove all people and main foreground objects from this image. Fill the empty space naturally to show the empty background scenery.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/png', data: base64Image } }
            ]
        },
        config: { responseModalities: [Modality.IMAGE] }
    });

    const generatedPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (generatedPart?.inlineData?.data) {
        return `data:image/png;base64,${generatedPart.inlineData.data}`;
    }
    throw new Error("Failed to clean background");
}

export async function generateThumbnail(config: GenerationConfig): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API key not found. Please select an API key.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const { 
      prompt, 
      imageBytes, // Legacy
      remixImageBytes,
      backgroundImageBytes,
      subjectImageBytes,
      propImageBytes,
      poseImageBytes,
      aspectRatio, 
      style, 
      brandKit, 
      emotion,
      emotionIntensity,
      pose,
      overlayText
  } = config;

  try {
    // Construct a highly structured prompt for the model
    let systemDirectives = `Role: You are a world-class YouTube Thumbnail Designer known for high Click-Through Rates (CTR).
    Task: Create a single, high-impact thumbnail image.
    
    Design Specifications:
    - Aspect Ratio: Target ${aspectRatio || '16:9'}.
    - Style: ${style || 'Modern and Viral'}.
    ${brandKit ? `- Brand Identity: Use ${brandKit.primaryColor} as the dominant accent color. Typography should appear ${brandKit.fontStyle}.` : ''}
    ${emotion ? `- Facial Expression: Subject must look ${emotion} (Intensity: ${emotionIntensity || 75}%). Exaggerate it for YouTube.` : ''}
    ${pose ? `- Subject Pose: ${pose}.` : ''}
    ${overlayText ? `- Text Overlay: Render the text "${overlayText}" in a huge, legible, high-contrast font.` : ''}
    
    Content Description:
    ${prompt}
    
    Constraints:
    - Make the subject pop from the background.
    - Use rule of thirds.
    - Ensure text is readable on small screens.
    - High saturation and contrast.`;

    const parts: any[] = [];
    
    // Prioritize new workflow inputs
    const baseImage = remixImageBytes || imageBytes;

    if (baseImage) {
      parts.push({ text: "Instructions: Remix the following image. Use its layout/composition as a base but apply the requested style and overlay." });
      parts.push({
        inlineData: {
          data: baseImage,
          mimeType: 'image/png' // Defaulting to png/jpeg usually works for flash models
        }
      });
    }

    if (backgroundImageBytes) {
         parts.push({ text: "Instructions: Use the following image as the background for the thumbnail." });
         parts.push({
            inlineData: {
              data: backgroundImageBytes,
              mimeType: 'image/png'
            }
          });
    }

    if (subjectImageBytes) {
         parts.push({ text: "Instructions: Use the person/character in the following image as the Main Subject of the thumbnail." });
         parts.push({
            inlineData: {
              data: subjectImageBytes,
              mimeType: 'image/png'
            }
          });
    }

    if (propImageBytes) {
         parts.push({ text: "Instructions: Include the object in the following image as a key Prop in the thumbnail." });
         parts.push({
            inlineData: {
              data: propImageBytes,
              mimeType: 'image/png'
            }
          });
    }

    if (poseImageBytes) {
        parts.push({ text: "Instructions: Use the pose, composition, and structural lines from the following sketch/reference image for the main subject placement." });
        parts.push({
           inlineData: {
             data: poseImageBytes,
             mimeType: 'image/png'
           }
         });
   }

    parts.push({ text: systemDirectives });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
         throw new Error("No image generated.");
    }

    const generatedPart = candidates[0].content?.parts?.find(p => p.inlineData);
    
    if (generatedPart && generatedPart.inlineData && generatedPart.inlineData.data) {
        return `data:image/png;base64,${generatedPart.inlineData.data}`;
    }

    throw new Error("Response did not contain image data.");

  } catch (error) {
    console.error("Error during thumbnail generation:", error);
    throw error;
  }
}

export async function generateAsset(prompt: string, type: 'background' | 'subject' | 'prop'): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API key not found.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let systemPrompt = "";
    if (type === 'background') {
        systemPrompt = `Generate a high-quality YouTube thumbnail background. Context: ${prompt}. 
        Requirements: No text, high contrast, suitable for overlaying text and subjects. 16:9 Aspect Ratio.`;
    } else if (type === 'subject') {
        systemPrompt = `Generate a character or person for a YouTube thumbnail. Description: ${prompt}.
        Requirements: Solid white background (easy to remove), exaggerated expression, high detail, professional lighting, hyper-realistic.`;
    } else {
        systemPrompt = `Generate a prop or object for a YouTube thumbnail. Item: ${prompt}.
        Requirements: Solid white background, 3D render style, high saturation.`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: systemPrompt }] },
        config: { responseModalities: [Modality.IMAGE] }
    });

    const generatedPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (generatedPart && generatedPart.inlineData && generatedPart.inlineData.data) {
        return `data:image/png;base64,${generatedPart.inlineData.data}`;
    }
    throw new Error("Failed to generate asset");
}

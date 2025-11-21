
import { RemixAnalysis, ChatMessage, ThumbCopilotContext } from '../types';

// Mock Analysis of an uploaded image
export const mockAnalyzeImage = async (imageUrl: string): Promise<RemixAnalysis> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        originalUrl: imageUrl,
        subjects: [
            { id: 'sub_1', name: 'Main Person', thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' }
        ],
        props: [
            { id: 'prop_1', label: 'Smartphone', thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80' },
            { id: 'prop_2', label: 'Stack of Cash', thumbnailUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=100&q=80' }
        ],
        background: { id: 'bg_1', thumbnailUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=100&q=80', label: 'Blurred Office' },
        textBoxes: [
            { id: 'txt_1', content: 'I QUIT!', position: 'middle' }
        ],
        detectedEmotion: 'surprised'
      });
    }, 1500); // Simulate network delay
  });
};

// Mock Chatbot Response
export const mockAskCopilot = async (
  context: ThumbCopilotContext, 
  userMessage: string
): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let content = "I can help with that!";
      let suggestions: any[] = [];

      // Context-aware mocking
      if (context.step === 'idea') {
          content = "Here are 3 viral concepts based on your title:";
          suggestions = [
              { label: "Use Concept 1", action: () => console.log('Concept 1') }
          ];
      } else if (context.step === 'polish') {
          content = "Here is a punchier hook for your overlay:";
          suggestions = [
              { label: "Use 'DON'T DO THIS'", action: () => {} } // Action injected by parent
          ];
      } else if (context.step === 'remixAnalysis') {
          content = "This thumbnail has good contrast, but the subject feels a bit small. Try zooming in or swapping the background for something cleaner.";
          suggestions = [
             { label: "Suggestion: Blur Background More", action: () => {}}
          ]
      }

      resolve({
        id: Date.now().toString(),
        role: 'assistant',
        content: content + " (Mocked Response)",
        suggestions: suggestions
      });
    }, 1000);
  });
};

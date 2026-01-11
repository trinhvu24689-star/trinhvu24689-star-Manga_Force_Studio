import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, Character, Panel, ComicProject } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const TEXT_MODEL = 'gemini-3-pro-preview'; // Best for creative writing
const IMAGE_MODEL = 'gemini-2.5-flash-image'; // Changed to standard image model to avoid 403 errors

export const generateComicScript = async (
  title: string, 
  genre: string, 
  premise: string, 
  existingCharacters: Character[],
  language: 'en' | 'vi' = 'en'
): Promise<Partial<Panel>[]> => {
  const characterContext = existingCharacters.length > 0 
    ? `Use these existing characters: ${existingCharacters.map(c => `${c.name} (${c.description})`).join(', ')}.`
    : "Create suitable characters for the story.";

  const langInstruction = language === 'vi' 
    ? "Generate the 'dialogue' in Vietnamese. Keep 'description' in English for better image generation prompting." 
    : "Generate the 'dialogue' in English. Keep 'description' in English.";

  const prompt = `
    Act as a professional comic book writer.
    Title: ${title}
    Genre: ${genre}
    Premise: ${premise}
    ${characterContext}

    Generate a detailed script for a comic book scene based on this premise. 
    Break it down into 4-8 panels.
    For each panel, provide a visual description for the artist and the dialogue/caption.
    
    ${langInstruction}
  `;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "Visual description of the panel scene, including camera angle and lighting. MUST BE IN ENGLISH." },
            dialogue: { type: Type.STRING, description: `Dialogue or captions for the panel. Format: 'Character: Text'. MUST BE IN ${language === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.` },
            suggestedAspectRatio: { type: Type.STRING, description: "Suggested aspect ratio (1:1, 16:9, 9:16, 3:4, 4:3)" }
          },
          required: ["description", "dialogue"]
        }
      }
    }
  });

  const rawJson = response.text || "[]";
  try {
    const parsed = JSON.parse(rawJson);
    // Map to our internal type, providing defaults
    return parsed.map((p: any, index: number) => ({
      description: p.description,
      dialogue: p.dialogue,
      aspectRatio: (p.suggestedAspectRatio as AspectRatio) || AspectRatio.Square,
      panelNumber: index + 1
    }));
  } catch (e) {
    console.error("Failed to parse script JSON", e);
    return [];
  }
};

export const generateFullStory = async (
    topic: string,
    language: 'en' | 'vi' = 'en'
  ): Promise<ComicProject> => {
    const langInstruction = language === 'vi' 
      ? "Generate Title, Premise, Genre, Style and Dialogue in Vietnamese. BUT keep Character Description and Panel Description in English." 
      : "Generate everything in English.";
  
    const prompt = `
      Act as a Lead Creative Director for a comic studio.
      Topic/Idea: "${topic}"
  
      Create a full comic project configuration based on this topic.
      1. Create a catchy Title.
      2. Define the Genre and Art Style.
      3. Write a compelling Premise.
      4. Create 2-4 Main Characters with names and visual descriptions.
      5. Write a 4-6 panel opening script.
  
      ${langInstruction}
    `;
  
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            genre: { type: Type.STRING },
            style: { type: Type.STRING },
            premise: { type: Type.STRING },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING, description: "Visual physical description in English for image generation." }
                },
                required: ["name", "description"]
              }
            },
            panels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING, description: "Visual scene description in English." },
                  dialogue: { type: Type.STRING },
                  aspectRatio: { type: Type.STRING }
                },
                required: ["description", "dialogue"]
              }
            }
          },
          required: ["title", "genre", "style", "premise", "characters", "panels"]
        }
      }
    });
  
    const data = JSON.parse(response.text || "{}");
    
    // Map response to our internal structure
    return {
      title: data.title || "Untitled",
      genre: data.genre || "General",
      style: data.style || "Comic Book",
      premise: data.premise || topic,
      characters: (data.characters || []).map((c: any) => ({
        id: crypto.randomUUID(),
        name: c.name,
        description: c.description
      })),
      panels: (data.panels || []).map((p: any, idx: number) => ({
        id: crypto.randomUUID(),
        panelNumber: idx + 1,
        description: p.description,
        dialogue: p.dialogue,
        aspectRatio: (p.aspectRatio as AspectRatio) || AspectRatio.Square,
        charactersInvolved: []
      }))
    };
  };

export const generateCharacterConcept = async (name: string, traits: string, style: string): Promise<string> => {
  const prompt = `
    Character Design Sheet.
    Name: ${name}
    Traits: ${traits}
    Art Style: ${style}
    
    Generate a full-body character design sheet on a white background. High detailed, concept art.
  `;

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: "3:4", // Portrait for character sheets
          // imageSize removed for gemini-2.5-flash-image compatibility
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Character generation failed:", error);
    throw error;
  }
};

export const generatePanelImage = async (
  panel: Panel, 
  style: string, 
  characters: Character[]
): Promise<string> => {
  // Construct a prompt that includes character appearances to maintain consistency (naive approach, but effective with good descriptions)
  const characterPrompts = characters
    .map(c => `Character Reference: ${c.name} looks like ${c.description}`)
    .join('. ');

  const prompt = `
    Comic Book Panel.
    Art Style: ${style} (Manga/Comic High Quality).
    
    Scene Description: ${panel.description}
    
    ${characterPrompts}
    
    Ensure the composition matches the description dynamically. 
    Do NOT include speech bubbles or text inside the image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: panel.aspectRatio,
          // imageSize removed for gemini-2.5-flash-image compatibility
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Panel generation failed:", error);
    throw error;
  }
};
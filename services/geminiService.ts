import { GoogleGenAI, Type } from "@google/genai";
import { RoleplayScenario } from "../types";

// Note: For Veo (Video), we need to ensure the API key is passed dynamically if possible,
// but standard initialization uses process.env.API_KEY.
// The UI will handle the specific API key selection for Veo if needed via window.aistudio.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Actua com a 'Copilot Estratègic' de NeuroGuard.
NO ets un metge, ni un pare, ni un col·lega gamer.
ETS: Una intel·ligència objectiva, col·laborativa i basada en dades.
TONO: Empàtic però analític. Directe. Professional però proper.
OBJECTIU: Ajudar l'usuari a optimitzar la seva "Bateria de Vitalitat" (benestar digital).

EXEMPLES DE RESPOSTA:
Incorrecte: "Hauries de deixar de jugar, és dolent per a tu."
Correcte: "Detecto que la teva bateria està al 20%. Les dades suggereixen que una pausa de 10 minuts augmentaria el teu rendiment cognitiu un 15%. Iniciem protocol de recàrrega?"
`;

export const generateRoleplayScenario = async (topic: string): Promise<RoleplayScenario | null> => {
  try {
    const prompt = `
      Genera un escenari de rol (Roleplay) interactiu per a una app anomenada "NeuroGuard".
      El públic objectiu són adolescents espanyols (14-18 anys).
      Tema: ${topic} (ex: dir "NO" a les apostes online, loot boxes, pressió de grup).
      
      ${SYSTEM_INSTRUCTION}
      
      ESTIL I TO ADDICIONAL:
      - Llenguatge: Espanyol d'Espanya actual / Català col·loquial, usant argot juvenil natural.
      
      FORMAT DE SORTIDA (JSON):
      Retorna un objecte JSON amb aquesta estructura:
      {
        "id": "scenario_unique_id",
        "context": "Descripció breu de la situació",
        "npc_dialogue": "La frase que et diu l''amic' pressionant.",
        "options": [
           {
             "text": "Resposta Assertiva (correcta)",
             "feedback": "Anàlisi objectiva de l'impacte social positiu.",
             "score_impact": 10
           },
           {
             "text": "Resposta Passiva (cedir)",
             "feedback": "Anàlisi de la pèrdua d'autonomia.",
             "score_impact": -5
           },
           {
             "text": "Resposta Agressiva",
             "feedback": "Anàlisi de l'impacte relacional negatiu.",
             "score_impact": 0
           }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            context: { type: Type.STRING },
            npc_dialogue: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                  score_impact: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RoleplayScenario;
    }
    return null;
  } catch (error) {
    console.error("Error generating scenario:", error);
    return {
      id: "fallback_01",
      context: "Estàs al pati de l'institut. El Marc t'ensenya el mòbil.",
      npc_dialogue: "Mira aquesta quota. Són diners gratis, posa-hi 5 €.",
      options: [
        { text: "Prefereixo gastar-m'ho en menjar.", feedback: "Bona estratègia de desviació.", score_impact: 10 },
        { text: "D'acord, pren.", feedback: "Pèrdua de control financer detectada.", score_impact: -5 },
        { text: "Deixa'm en pau!", feedback: "Reacció reactiva. Pot escalar el conflicte.", score_impact: 0 }
      ]
    };
  }
};

export const generateMemoryImage = async (memoryText: string): Promise<string | null> => {
  try {
    const prompt = `
      Genera una imatge abstracta, artística i relaxant que representi aquest record o moment positiu: "${memoryText}".
      Estil: Aquarel·la suau, minimalista, càlida.
      La imatge ha de transmetre calma i positivitat.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: prompt,
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating memory image:", error);
    return null; 
  }
};

export const generateEducationalVideo = async (topic: string, description: string): Promise<string | null> => {
  let retryCount = 0;
  const maxRetries = 1;

  while (retryCount <= maxRetries) {
    try {
      // Check for API Key selection for Veo models (Mandatory)
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) {
              await window.aistudio.openSelectKey();
          }
      }

      // Re-initialize AI client to ensure it picks up the potentially newly selected key
      // In a real scenario, the key might be injected via environment, but Veo often requires explicit user selection in demos.
      const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const prompt = `Educational video about ${topic}. Visual style: minimal, modern motion graphics, calm colors. Content: ${description.substring(0, 200)}`;

      let operation = await veoAi.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: prompt,
          config: {
              numberOfVideos: 1,
              resolution: '720p',
              aspectRatio: '16:9'
          }
      });

      // Polling
      while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          operation = await veoAi.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
          // We need to fetch the blob to display it, appending the key
          const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
          const blob = await videoResponse.blob();
          return URL.createObjectURL(blob);
      }

      return null;

    } catch (error: any) {
      console.error("Error generating video:", error);
      
      const errorMessage = error.toString();
      // If "Requested entity was not found" (404), it indicates a key/project issue.
      if (errorMessage.includes("Requested entity was not found") || errorMessage.includes("404")) {
           if (retryCount < maxRetries && window.aistudio) {
               console.log("Veo entity not found. Prompting for API key selection and retrying...");
               try {
                  await window.aistudio.openSelectKey();
                  retryCount++;
                  continue; // Retry the loop
               } catch(e) { 
                  console.error("Key selection failed", e);
                  return null;
               }
           }
      }
      return null;
    }
  }
  return null;
};
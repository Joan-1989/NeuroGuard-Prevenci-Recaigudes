
import { GoogleGenAI, Type } from "@google/genai";
import { RoleplayScenario } from "../types";

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

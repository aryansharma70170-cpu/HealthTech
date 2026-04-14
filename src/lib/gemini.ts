import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeSymptoms(transcript: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following patient symptom transcript (which may be in English, Hindi, or Marathi) and extract structured information.
    Transcript: "${transcript}"`,
    config: {
      systemInstruction: "You are a medical triage assistant. Extract symptoms, duration, and severity. Provide a concise summary in English and a triage level (Low, Medium, High, Urgent).",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          extractedSymptoms: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          severity: {
            type: Type.STRING,
            enum: ["Low", "Medium", "High", "Urgent"]
          },
          summary: { type: Type.STRING },
          duration: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["extractedSymptoms", "severity", "summary", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function summarizeConsultation(transcript: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize this telemedicine consultation transcript into a digital prescription/summary.
    Transcript: "${transcript}"`,
    config: {
      systemInstruction: "You are a doctor's assistant. Create a structured summary including: Key Complaints, Diagnosis, Prescribed Medications, and Follow-up Instructions.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          complaints: { type: Type.ARRAY, items: { type: Type.STRING } },
          diagnosis: { type: Type.STRING },
          medications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dosage: { type: Type.STRING },
                frequency: { type: Type.STRING }
              }
            }
          },
          followUp: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text);
}

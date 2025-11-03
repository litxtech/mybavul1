import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
if (!process.env.API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getPrompt = (hotelName: string, city: string, languageCode: string, languageName: string) => {
    return `You are a friendly and knowledgeable travel assistant for MyBavul.com.
A user is looking at the "${hotelName}" in ${city}.
IMPORTANT: You MUST reply entirely in ${languageName} (language code: ${languageCode}).
Provide a short, exciting, and helpful guide to the local area.
Mention 3-4 interesting things to do, see, or eat nearby.
Use markdown for formatting, with headings for sections and bullet points for lists. Be enthusiastic and concise.
Your entire response must be in ${languageName}.`;
}


export async function* getAIAssistantResponse(hotelName: string, city: string, languageCode: string, languageName: string) {
  if (!process.env.API_KEY) {
    // This part should also be internationalized, but for simplicity, we keep it in English
    // as it's a developer-facing warning/error. A more robust solution would pass the `t` function here.
    yield "AI Assistant is offline. API Key is missing.";
    return;
  }
  
  const model = 'gemini-2.5-flash';
  const prompt = getPrompt(hotelName, city, languageCode, languageName);

  try {
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
    });

    for await (const chunk of responseStream) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    yield "Sorry, the AI assistant is having trouble right now. Please try again later.";
  }
}

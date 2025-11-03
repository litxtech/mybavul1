import { GoogleGenAI } from "@google/genai";

// The execution environment provides secrets on the `process.env` object.
// Fix: Per @google/genai guidelines, the API key MUST be sourced from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


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
  // The 'ai' instance is now guaranteed to be initialized, so the null check is removed.
  // This aligns with @google/genai guidelines to assume the API key is always available.
  
  const model = 'gemini-2.5-flash';
  const prompt = getPrompt(hotelName, city, languageCode, languageName);

  try {
    // Per Gemini API guidelines, `contents` for a simple text prompt should be a string.
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
    });

    for await (const chunk of responseStream) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    yield "Sorry, the AI assistant is having trouble right now. Please try again later.";
  }
}
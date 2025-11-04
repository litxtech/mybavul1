import { GoogleGenAI, FunctionDeclaration, Type, Chat } from "@google/genai";

// Per Gemini API guidelines, the API key MUST be obtained from the environment.
const apiKey = import.meta.env?.VITE_API_KEY;
if (!apiKey) {
  console.error("VITE_API_KEY is not configured. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });


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
  if (!apiKey) {
    yield "Sorry, the AI Assistant is not available due to a configuration issue.";
    return;
  }
  
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


// --- AI Trip Planner with Function Calling ---

const searchHotelsFunctionDeclaration: FunctionDeclaration = {
  name: 'searchHotels',
  parameters: {
    type: Type.OBJECT,
    description: 'Performs a hotel search based on user criteria.',
    properties: {
      city: {
        type: Type.STRING,
        description: 'The destination city. Must be one of: barcelona, madrid, palma, istanbul.',
      },
      checkin: {
        type: Type.STRING,
        description: 'The check-in date in YYYY-MM-DD format.',
      },
      checkout: {
        type: Type.STRING,
        description: 'The check-out date in YYYY-MM-DD format.',
      },
      guests: {
        type: Type.INTEGER,
        description: 'The number of guests.',
      },
    },
    required: ['city', 'checkin', 'checkout', 'guests'],
  },
};


export const createAIPlannerChat = (languageName: string): Chat => {
  if (!apiKey) {
    throw new Error("Cannot create AI Planner chat, API key is not configured.");
  }
  
  const systemInstruction = `You are a proactive and friendly travel planner for MyBavul.com.
Your goal is to help the user plan their trip by gathering necessary information and then using the searchHotels tool.
1.  Start by asking the user what kind of trip they're looking for.
2.  Engage in a natural conversation to determine the destination city, check-in date, check-out date, and number of guests.
3.  You MUST ask clarifying questions one by one until you have all the required information. For example, if the user says "next month", ask for specific dates.
4.  Once you have all four parameters (city, checkin, checkout, guests), you MUST call the searchHotels function with the collected data.
5.  IMPORTANT: Your entire conversation MUST be in ${languageName}. Do not use any other language.`;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: [searchHotelsFunctionDeclaration] }],
    },
  });
};